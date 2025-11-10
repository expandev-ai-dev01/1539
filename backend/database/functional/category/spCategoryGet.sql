/**
 * @summary
 * Retrieves detailed information for a specific category including hierarchy information
 * and task count.
 *
 * @procedure spCategoryGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/category/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier to retrieve
 *
 * @testScenarios
 * - Valid retrieval of existing category
 * - Validation failure: category doesn't exist
 * - Validation failure: category belongs to different account
 * - Security validation: invalid account
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryGet]
  @idAccount INTEGER,
  @idCategory INTEGER
AS
BEGIN
  SET NOCOUNT ON;

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
   * @rule {db-category-get,fn-category-management} Retrieve category details with hierarchy and task count
   */
  /**
   * @output {CategoryDetail, 1, n}
   * @column {INT} idCategory
   *   - Description: Category identifier
   * @column {NVARCHAR} name
   *   - Description: Category name
   * @column {VARCHAR} color
   *   - Description: Category color code
   * @column {NVARCHAR} icon
   *   - Description: Category icon identifier
   * @column {INT} idParent
   *   - Description: Parent category identifier
   * @column {INT} level
   *   - Description: Hierarchy level
   * @column {BIT} isDefault
   *   - Description: Indicates if category is system default
   * @column {INT} taskCount
   *   - Description: Number of active tasks in category
   * @column {DATETIME2} dateCreated
   *   - Description: Category creation timestamp
   * @column {DATETIME2} dateModified
   *   - Description: Category last modification timestamp
   */
  SELECT
    cat.[idCategory],
    cat.[name],
    cat.[color],
    cat.[icon],
    cat.[idParent],
    cat.[level],
    cat.[isDefault],
    ISNULL((
      SELECT COUNT(DISTINCT tskCat.[idTask])
      FROM [functional].[taskCategory] tskCat
        JOIN [functional].[task] tsk ON (tsk.[idAccount] = tskCat.[idAccount] AND tsk.[idTask] = tskCat.[idTask])
      WHERE tskCat.[idAccount] = @idAccount
        AND tskCat.[idCategory] = cat.[idCategory]
        AND tsk.[deleted] = 0
        AND tsk.[status] <> 2
    ), 0) AS [taskCount],
    cat.[dateCreated],
    cat.[dateModified]
  FROM [functional].[category] cat
  WHERE cat.[idCategory] = @idCategory
    AND cat.[idAccount] = @idAccount
    AND cat.[deleted] = 0;
END;
GO