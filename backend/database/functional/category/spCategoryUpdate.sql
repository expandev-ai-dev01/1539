/**
 * @summary
 * Updates an existing category's name, color, and icon. Validates that default
 * categories cannot be deleted and enforces name uniqueness.
 *
 * @procedure spCategoryUpdate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/category/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier to update
 *
 * @param {NVARCHAR(50)} name
 *   - Required: Yes
 *   - Description: Updated category name
 *
 * @param {VARCHAR(7)} color
 *   - Required: Yes
 *   - Description: Updated hexadecimal color code
 *
 * @param {NVARCHAR(50)} icon
 *   - Required: No
 *   - Description: Updated icon identifier
 *
 * @testScenarios
 * - Valid update of custom category
 * - Valid update of default category (name, color, icon only)
 * - Validation failure: category doesn't exist
 * - Validation failure: duplicate name
 * - Validation failure: invalid color format
 * - Validation failure: name too short or too long
 * - Security validation: invalid account
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryUpdate]
  @idAccount INTEGER,
  @idCategory INTEGER,
  @name NVARCHAR(50),
  @color VARCHAR(7),
  @icon NVARCHAR(50) = NULL
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
   * @validation Category existence validation
   * @throw {categoryDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [functional].[category] cat WHERE cat.[idCategory] = @idCategory AND cat.[idAccount] = @idAccount AND cat.[deleted] = 0)
  BEGIN
    ;THROW 51000, 'categoryDoesntExist', 1;
  END;

  /**
   * @validation Duplicate name validation
   * @throw {categoryNameAlreadyExists}
   */
  IF EXISTS (SELECT * FROM [functional].[category] cat WHERE cat.[idAccount] = @idAccount AND cat.[name] = LTRIM(RTRIM(@name)) AND cat.[idCategory] <> @idCategory AND cat.[deleted] = 0)
  BEGIN
    ;THROW 51000, 'categoryNameAlreadyExists', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-category-update,fn-category-management} Update category with validated parameters
     */
    BEGIN TRAN;

      UPDATE [functional].[category]
      SET
        [name] = LTRIM(RTRIM(@name)),
        [color] = @color,
        [icon] = @icon,
        [dateModified] = GETUTCDATE()
      WHERE [idCategory] = @idCategory
        AND [idAccount] = @idAccount;

      /**
       * @output {CategoryUpdated, 1, 1}
       * @column {INT} idCategory
       *   - Description: Updated category identifier
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