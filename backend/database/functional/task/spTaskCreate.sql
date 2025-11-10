/**
 * @summary
 * Creates a new task with all specified attributes including title, description,
 * due date, priority, estimated time, and recurrence configuration. Validates all
 * input parameters according to business rules and returns the created task details.
 *
 * @procedure spTaskCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier who is creating the task
 *
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Task title (3-100 characters, cannot be only whitespace)
 *
 * @param {NVARCHAR(1000)} description
 *   - Required: No
 *   - Description: Detailed task description (max 1000 characters)
 *
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: Task due date (cannot be in the past)
 *
 * @param {INT} priority
 *   - Required: No
 *   - Description: Priority level (0=Low, 1=Medium, 2=High, default=1)
 *
 * @param {INT} estimatedTime
 *   - Required: No
 *   - Description: Estimated completion time in minutes (5-1440)
 *
 * @param {NVARCHAR(MAX)} recurrenceConfig
 *   - Required: No
 *   - Description: JSON configuration for recurring tasks
 *
 * @returns {INT} idTask - Created task identifier
 *
 * @testScenarios
 * - Valid creation with only required fields (title)
 * - Valid creation with all optional fields
 * - Validation failure: title too short (< 3 characters)
 * - Validation failure: title too long (> 100 characters)
 * - Validation failure: title only whitespace
 * - Validation failure: description too long (> 1000 characters)
 * - Validation failure: due date in the past
 * - Validation failure: invalid priority value
 * - Validation failure: estimated time out of range
 * - Security validation: invalid account/user combination
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(1000) = NULL,
  @dueDate DATE = NULL,
  @priority INTEGER = 1,
  @estimatedTime INTEGER = NULL,
  @recurrenceConfig NVARCHAR(MAX) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {titleRequired}
   */
  IF (@title IS NULL OR LTRIM(RTRIM(@title)) = '')
  BEGIN
    ;THROW 51000, 'titleRequired', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleTooShort}
   */
  IF (LEN(LTRIM(RTRIM(@title))) < 3)
  BEGIN
    ;THROW 51000, 'titleTooShort', 1;
  END;

  /**
   * @validation Title maximum length validation
   * @throw {titleTooLong}
   */
  IF (LEN(@title) > 100)
  BEGIN
    ;THROW 51000, 'titleTooLong', 1;
  END;

  /**
   * @validation Description maximum length validation
   * @throw {descriptionTooLong}
   */
  IF (@description IS NOT NULL AND LEN(@description) > 1000)
  BEGIN
    ;THROW 51000, 'descriptionTooLong', 1;
  END;

  /**
   * @validation Due date cannot be in the past
   * @throw {dueDateInPast}
   */
  IF (@dueDate IS NOT NULL AND @dueDate < CAST(GETUTCDATE() AS DATE))
  BEGIN
    ;THROW 51000, 'dueDateInPast', 1;
  END;

  /**
   * @validation Priority value range validation
   * @throw {invalidPriority}
   */
  IF (@priority NOT BETWEEN 0 AND 2)
  BEGIN
    ;THROW 51000, 'invalidPriority', 1;
  END;

  /**
   * @validation Estimated time range validation
   * @throw {invalidEstimatedTime}
   */
  IF (@estimatedTime IS NOT NULL AND (@estimatedTime < 5 OR @estimatedTime > 1440))
  BEGIN
    ;THROW 51000, 'invalidEstimatedTime', 1;
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

  BEGIN TRY
    /**
     * @rule {db-task-creation,fn-task-management} Create new task with validated parameters
     */
    BEGIN TRAN;

      DECLARE @idTask INTEGER;
      DECLARE @currentDateTime DATETIME2 = GETUTCDATE();

      INSERT INTO [functional].[task] (
        [idAccount],
        [idUser],
        [title],
        [description],
        [dueDate],
        [priority],
        [estimatedTime],
        [recurrenceConfig],
        [status],
        [dateCreated],
        [dateModified],
        [deleted]
      )
      VALUES (
        @idAccount,
        @idUser,
        LTRIM(RTRIM(@title)),
        @description,
        @dueDate,
        @priority,
        @estimatedTime,
        @recurrenceConfig,
        0,
        @currentDateTime,
        @currentDateTime,
        0
      );

      SET @idTask = SCOPE_IDENTITY();

      /**
       * @output {TaskCreated, 1, 1}
       * @column {INT} idTask
       *   - Description: Created task identifier
       */
      SELECT @idTask AS [idTask];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO