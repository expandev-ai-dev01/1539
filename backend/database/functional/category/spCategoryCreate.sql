/**
 * @summary
 * Creates a new category with specified name, color, icon, and optional parent category.
 * Validates all input parameters including hierarchy depth limits and duplicate name checks.
 * Automatically generates hierarchical node path for category organization.
 *
 * @procedure spCategoryCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/category
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier who is creating the category
 *
 * @param {NVARCHAR(50)} name
 *   - Required: Yes
 *   - Description: Category name (2-50 characters, no special characters except hyphen and underscore)
 *
 * @param {VARCHAR(7)} color
 *   - Required: No
 *   - Description: Hexadecimal color code (default: #3498db)
 *
 * @param {NVARCHAR(50)} icon
 *   - Required: No
 *   - Description: Icon identifier from system library
 *
 * @param {INT} idParent
 *   - Required: No
 *   - Description: Parent category identifier for subcategories
 *
 * @returns {INT} idCategory - Created category identifier
 *
 * @testScenarios
 * - Valid creation with only required fields
 * - Valid creation with all optional fields
 * - Valid creation of subcategory (level 2)
 * - Valid creation of sub-subcategory (level 3)
 * - Validation failure: name too short (< 2 characters)
 * - Validation failure: name too long (> 50 characters)
 * - Validation failure: duplicate name for same account
 * - Validation failure: invalid color format
 * - Validation failure: parent category doesn't exist
 * - Validation failure: exceeds maximum hierarchy depth (3 levels)
 * - Validation failure: maximum categories limit reached (50)
 * - Security validation: invalid account/user combination
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @name NVARCHAR(50),
  @color VARCHAR(7) = '#3498db',
  @icon NVARCHAR(50) = NULL,
  @idParent INTEGER = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {nameRequired}
   */
  IF (@name IS NULL OR LTRIM(RTRIM(@name)) = '')
  BEGIN
    ;THROW 51000, 'nameRequired', 1;
  END;

  /**
   * @validation Name minimum length validation
   * @throw {nameTooShort}
   */
  IF (LEN(LTRIM(RTRIM(@name))) < 2)
  BEGIN
    ;THROW 51000, 'nameTooShort', 1;
  END;

  /**
   * @validation Name maximum length validation
   * @throw {nameTooLong}
   */
  IF (LEN(@name) > 50)
  BEGIN
    ;THROW 51000, 'nameTooLong', 1;
  END;

  /**
   * @validation Name special characters validation
   * @throw {nameInvalidCharacters}
   */
  IF (@name LIKE '%[^a-zA-Z0-9 _-]%')
  BEGIN
    ;THROW 51000, 'nameInvalidCharacters', 1;
  END;

  /**
   * @validation Color format validation
   * @throw {invalidColorFormat}
   */
  IF (@color NOT LIKE '#[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]')
  BEGIN
    ;THROW 51000, 'invalidColorFormat', 1;
  END;

  /**
   * @validation Account existence validation
   * @throw {accountDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [subscription].[account] acc WHERE acc.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'accountDoesntExist', 1;
  END;

  /**
   * @validation User existence and account association validation
   * @throw {userDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [security].[user] usr WHERE usr.[idUser] = @idUser AND usr.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'userDoesntExist', 1;
  END;

  /**
   * @validation Duplicate name validation
   * @throw {categoryNameAlreadyExists}
   */
  IF EXISTS (SELECT * FROM [functional].[category] cat WHERE cat.[idAccount] = @idAccount AND cat.[name] = LTRIM(RTRIM(@name)) AND cat.[deleted] = 0)
  BEGIN
    ;THROW 51000, 'categoryNameAlreadyExists', 1;
  END;

  /**
   * @validation Maximum categories limit validation
   * @throw {categoryLimitReached}
   */
  IF ((SELECT COUNT(*) FROM [functional].[category] cat WHERE cat.[idAccount] = @idAccount AND cat.[isDefault] = 0 AND cat.[deleted] = 0) >= 50)
  BEGIN
    ;THROW 51000, 'categoryLimitReached', 1;
  END;

  /**
   * @validation Parent category existence validation
   * @throw {parentCategoryDoesntExist}
   */
  IF (@idParent IS NOT NULL AND NOT EXISTS (SELECT * FROM [functional].[category] cat WHERE cat.[idCategory] = @idParent AND cat.[idAccount] = @idAccount AND cat.[deleted] = 0))
  BEGIN
    ;THROW 51000, 'parentCategoryDoesntExist', 1;
  END;

  /**
   * @validation Maximum hierarchy depth validation
   * @throw {maximumHierarchyDepthExceeded}
   */
  IF (@idParent IS NOT NULL)
  BEGIN
    DECLARE @parentLevel INTEGER;
    SELECT @parentLevel = cat.[level]
    FROM [functional].[category] cat
    WHERE cat.[idCategory] = @idParent AND cat.[idAccount] = @idAccount;

    IF (@parentLevel >= 2)
    BEGIN
      ;THROW 51000, 'maximumHierarchyDepthExceeded', 1;
    END;
  END;

  BEGIN TRY
    /**
     * @rule {db-category-creation,fn-category-management} Create new category with validated parameters and hierarchical structure
     */
    BEGIN TRAN;

      DECLARE @idCategory INTEGER;
      DECLARE @currentDateTime DATETIME2 = GETUTCDATE();
      DECLARE @parentNode HIERARCHYID = NULL;
      DECLARE @newNode HIERARCHYID;

      IF (@idParent IS NOT NULL)
      BEGIN
        SELECT @parentNode = cat.[node]
        FROM [functional].[category] cat
        WHERE cat.[idCategory] = @idParent AND cat.[idAccount] = @idAccount;

        DECLARE @lastChildNode HIERARCHYID;
        SELECT @lastChildNode = MAX(cat.[node])
        FROM [functional].[category] cat
        WHERE cat.[idParent] = @idParent AND cat.[idAccount] = @idAccount;

        IF (@lastChildNode IS NULL)
        BEGIN
          SET @newNode = @parentNode.GetDescendant(NULL, NULL);
        END
        ELSE
        BEGIN
          SET @newNode = @parentNode.GetDescendant(@lastChildNode, NULL);
        END;
      END
      ELSE
      BEGIN
        DECLARE @lastRootNode HIERARCHYID;
        SELECT @lastRootNode = MAX(cat.[node])
        FROM [functional].[category] cat
        WHERE cat.[idParent] IS NULL AND cat.[idAccount] = @idAccount;

        SET @newNode = HIERARCHYID::GetRoot().GetDescendant(@lastRootNode, NULL);
      END;

      INSERT INTO [functional].[category] (
        [idAccount],
        [idUser],
        [name],
        [color],
        [icon],
        [idParent],
        [node],
        [isDefault],
        [dateCreated],
        [dateModified],
        [deleted]
      )
      VALUES (
        @idAccount,
        @idUser,
        LTRIM(RTRIM(@name)),
        @color,
        @icon,
        @idParent,
        @newNode,
        0,
        @currentDateTime,
        @currentDateTime,
        0
      );

      SET @idCategory = SCOPE_IDENTITY();

      /**
       * @output {CategoryCreated, 1, 1}
       * @column {INT} idCategory
       *   - Description: Created category identifier
       */
      SELECT @idCategory AS [idCategory];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO