/**
 * @summary
 * Soft deletes a category and removes all task associations. Default categories
 * cannot be deleted. Validates category existence and ownership before deletion.
 *
 * @procedure spCategoryDelete
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/category/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier to delete
 *
 * @testScenarios
 * - Valid deletion of custom category
 * - Valid deletion removes all task associations
 * - Valid deletion of category with subcategories
 * - Validation failure: attempting to delete default category
 * - Validation failure: category doesn't exist
 * - Security validation: invalid account
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryDelete]
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
   * @validation Default category deletion prevention
   * @throw {cannotDeleteDefaultCategory}
   */
  IF EXISTS (SELECT * FROM [functional].[category] cat WHERE cat.[idCategory] = @idCategory AND cat.[idAccount] = @idAccount AND cat.[isDefault] = 1)
  BEGIN
    ;THROW 51000, 'cannotDeleteDefaultCategory', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-category-delete,fn-category-management} Soft delete category and remove task associations
     */
    BEGIN TRAN;

      DELETE FROM [functional].[taskCategory]
      WHERE [idAccount] = @idAccount
        AND [idCategory] = @idCategory;

      UPDATE [functional].[category]
      SET
        [deleted] = 1,
        [dateModified] = GETUTCDATE()
      WHERE [idCategory] = @idCategory
        AND [idAccount] = @idAccount;

      /**
       * @output {CategoryDeleted, 1, 1}
       * @column {INT} idCategory
       *   - Description: Deleted category identifier
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