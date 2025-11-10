/**
 * @summary
 * Removes the association between a task and a category. Validates that the
 * association exists before removal.
 *
 * @procedure spTaskCategoryRemove
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/task/:idTask/category/:idCategory
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
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier
 *
 * @testScenarios
 * - Valid removal of task-category association
 * - Validation failure: association doesn't exist
 * - Security validation: invalid account
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCategoryRemove]
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
   * @validation Association existence validation
   * @throw {taskCategoryAssociationDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [functional].[taskCategory] tskCat WHERE tskCat.[idAccount] = @idAccount AND tskCat.[idTask] = @idTask AND tskCat.[idCategory] = @idCategory)
  BEGIN
    ;THROW 51000, 'taskCategoryAssociationDoesntExist', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-task-category-remove,fn-category-management} Remove task-category association
     */
    BEGIN TRAN;

      DELETE FROM [functional].[taskCategory]
      WHERE [idAccount] = @idAccount
        AND [idTask] = @idTask
        AND [idCategory] = @idCategory;

      /**
       * @output {TaskCategoryRemoved, 1, 1}
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