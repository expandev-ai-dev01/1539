/**
 * @summary
 * Associates a task with one or more categories. Validates task and category existence
 * and prevents duplicate associations.
 *
 * @procedure spTaskCategoryAssociate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/task/:idTask/category
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier to associate
 *
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier to associate
 *
 * @testScenarios
 * - Valid association of task to category
 * - Valid association of task to multiple categories
 * - Validation failure: task doesn't exist
 * - Validation failure: category doesn't exist
 * - Validation failure: duplicate association
 * - Security validation: invalid account
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCategoryAssociate]
  @idAccount INTEGER,
  @idTask INTEGER,
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
   * @validation Task existence validation
   * @throw {taskDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [functional].[task] tsk WHERE tsk.[idTask] = @idTask AND tsk.[idAccount] = @idAccount AND tsk.[deleted] = 0)
  BEGIN
    ;THROW 51000, 'taskDoesntExist', 1;
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
   * @validation Duplicate association validation
   * @throw {taskCategoryAlreadyAssociated}
   */
  IF EXISTS (SELECT * FROM [functional].[taskCategory] tskCat WHERE tskCat.[idAccount] = @idAccount AND tskCat.[idTask] = @idTask AND tskCat.[idCategory] = @idCategory)
  BEGIN
    ;THROW 51000, 'taskCategoryAlreadyAssociated', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-task-category-associate,fn-category-management} Create task-category association
     */
    BEGIN TRAN;

      INSERT INTO [functional].[taskCategory] (
        [idAccount],
        [idTask],
        [idCategory],
        [dateCreated]
      )
      VALUES (
        @idAccount,
        @idTask,
        @idCategory,
        GETUTCDATE()
      );

      /**
       * @output {TaskCategoryAssociated, 1, 1}
       * @column {INT} idTask
       *   - Description: Task identifier
       * @column {INT} idCategory
       *   - Description: Category identifier
       */
      SELECT @idTask AS [idTask], @idCategory AS [idCategory];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO