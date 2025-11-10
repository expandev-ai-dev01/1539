/**
 * @summary
 * Retrieves all categories for a specific account with hierarchical information,
 * including task count for each category. Returns categories ordered by hierarchy.
 *
 * @procedure spCategoryList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/category
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @testScenarios
 * - Valid retrieval with existing categories
 * - Valid retrieval with no categories (empty result)
 * - Valid retrieval showing hierarchy levels
 * - Valid retrieval showing task counts
 * - Security validation: invalid account
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryList]
  @idAccount INTEGER
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
   * @rule {db-category-list,fn-category-management} Retrieve all categories with hierarchy and task counts
   */
  /**
   * @output {CategoryList, n, n}
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
   *   - Description: Hierarchy level (0=root, 1=subcategory, 2=sub-subcategory)
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
  WHERE cat.[idAccount] = @idAccount
    AND cat.[deleted] = 0
  ORDER BY
    cat.[node];
END;
GO