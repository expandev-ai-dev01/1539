/**
 * @summary
 * Retrieves all categories associated with a specific task.
 *
 * @procedure spTaskCategoryList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task/:idTask/category
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier
 *
 * @testScenarios
 * - Valid retrieval with associated categories
 * - Valid retrieval with no categories (empty result)
 * - Validation failure: task doesn't exist
 * - Security validation: invalid account
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCategoryList]
  @idAccount INTEGER,
  @idTask INTEGER
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
   * @validation Task existence validation
   * @throw {taskDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [functional].[task] tsk WHERE tsk.[idTask] = @idTask AND tsk.[idAccount] = @idAccount AND tsk.[deleted] = 0)
  BEGIN
    ;THROW 51000, 'taskDoesntExist', 1;
  END;

  /**
   * @rule {db-task-category-list,fn-category-management} Retrieve all categories for task
   */
  /**
   * @output {TaskCategoryList, n, n}
   * @column {INT} idCategory
   *   - Description: Category identifier
   * @column {NVARCHAR} name
   *   - Description: Category name
   * @column {VARCHAR} color
   *   - Description: Category color code
   * @column {NVARCHAR} icon
   *   - Description: Category icon identifier
   * @column {DATETIME2} dateCreated
   *   - Description: Association creation timestamp
   */
  SELECT
    cat.[idCategory],
    cat.[name],
    cat.[color],
    cat.[icon],
    tskCat.[dateCreated]
  FROM [functional].[taskCategory] tskCat
    JOIN [functional].[category] cat ON (cat.[idAccount] = tskCat.[idAccount] AND cat.[idCategory] = tskCat.[idCategory])
  WHERE tskCat.[idAccount] = @idAccount
    AND tskCat.[idTask] = @idTask
    AND cat.[deleted] = 0
  ORDER BY
    cat.[name];
END;
GO