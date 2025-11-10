/**
 * @schema functional
 * Business logic schema for TODO list management system
 */
CREATE SCHEMA [functional];
GO

/**
 * @table task Task management table
 * @multitenancy true
 * @softDelete true
 * @alias tsk
 */
CREATE TABLE [functional].[task] (
  [idTask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(1000) NULL,
  [dueDate] DATE NULL,
  [priority] INTEGER NOT NULL,
  [estimatedTime] INTEGER NULL,
  [recurrenceConfig] NVARCHAR(MAX) NULL,
  [status] INTEGER NOT NULL,
  [dateCreated] DATETIME2 NOT NULL,
  [dateModified] DATETIME2 NOT NULL,
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table taskAttachment Task file attachments
 * @multitenancy true
 * @softDelete false
 * @alias tskAtt
 */
CREATE TABLE [functional].[taskAttachment] (
  [idTaskAttachment] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [fileName] NVARCHAR(255) NOT NULL,
  [fileSize] INTEGER NOT NULL,
  [fileType] VARCHAR(50) NOT NULL,
  [filePath] NVARCHAR(500) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL
);
GO

/**
 * @table taskTag Task categorization tags
 * @multitenancy true
 * @softDelete false
 * @alias tskTag
 */
CREATE TABLE [functional].[taskTag] (
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [tag] NVARCHAR(20) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL
);
GO

/**
 * @table category Task category management
 * @multitenancy true
 * @softDelete true
 * @alias cat
 */
CREATE TABLE [functional].[category] (
  [idCategory] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [name] NVARCHAR(50) NOT NULL,
  [color] VARCHAR(7) NOT NULL,
  [icon] NVARCHAR(50) NULL,
  [idParent] INTEGER NULL,
  [node] HIERARCHYID NULL,
  [level] AS [node].GetLevel(),
  [isDefault] BIT NOT NULL,
  [dateCreated] DATETIME2 NOT NULL,
  [dateModified] DATETIME2 NOT NULL,
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table taskCategory Task to category association
 * @multitenancy true
 * @softDelete false
 * @alias tskCat
 */
CREATE TABLE [functional].[taskCategory] (
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [idCategory] INTEGER NOT NULL,
  [dateCreated] DATETIME2 NOT NULL
);
GO

/**
 * @primaryKey pkTask
 * @keyType Object
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [pkTask] PRIMARY KEY CLUSTERED ([idTask]);
GO

/**
 * @primaryKey pkTaskAttachment
 * @keyType Object
 */
ALTER TABLE [functional].[taskAttachment]
ADD CONSTRAINT [pkTaskAttachment] PRIMARY KEY CLUSTERED ([idTaskAttachment]);
GO

/**
 * @primaryKey pkTaskTag
 * @keyType Relationship
 */
ALTER TABLE [functional].[taskTag]
ADD CONSTRAINT [pkTaskTag] PRIMARY KEY CLUSTERED ([idAccount], [idTask], [tag]);
GO

/**
 * @primaryKey pkCategory
 * @keyType Object
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [pkCategory] PRIMARY KEY CLUSTERED ([idCategory]);
GO

/**
 * @primaryKey pkTaskCategory
 * @keyType Relationship
 */
ALTER TABLE [functional].[taskCategory]
ADD CONSTRAINT [pkTaskCategory] PRIMARY KEY CLUSTERED ([idAccount], [idTask], [idCategory]);
GO

/**
 * @foreignKey fkTask_Account Multi-tenancy isolation
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [fkTask_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkTask_User Task creator reference
 * @target security.user
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [fkTask_User] FOREIGN KEY ([idUser])
REFERENCES [security].[user]([idUser]);
GO

/**
 * @foreignKey fkTaskAttachment_Account Multi-tenancy isolation
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[taskAttachment]
ADD CONSTRAINT [fkTaskAttachment_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkTaskAttachment_Task Attachment to task relationship
 * @target functional.task
 */
ALTER TABLE [functional].[taskAttachment]
ADD CONSTRAINT [fkTaskAttachment_Task] FOREIGN KEY ([idTask])
REFERENCES [functional].[task]([idTask]);
GO

/**
 * @foreignKey fkTaskTag_Account Multi-tenancy isolation
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[taskTag]
ADD CONSTRAINT [fkTaskTag_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkTaskTag_Task Tag to task relationship
 * @target functional.task
 */
ALTER TABLE [functional].[taskTag]
ADD CONSTRAINT [fkTaskTag_Task] FOREIGN KEY ([idTask])
REFERENCES [functional].[task]([idTask]);
GO

/**
 * @foreignKey fkCategory_Account Multi-tenancy isolation
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [fkCategory_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkCategory_User Category creator reference
 * @target security.user
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [fkCategory_User] FOREIGN KEY ([idUser])
REFERENCES [security].[user]([idUser]);
GO

/**
 * @foreignKey fkCategory_Parent Parent category reference
 * @target functional.category
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [fkCategory_Parent] FOREIGN KEY ([idParent])
REFERENCES [functional].[category]([idCategory]);
GO

/**
 * @foreignKey fkTaskCategory_Account Multi-tenancy isolation
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[taskCategory]
ADD CONSTRAINT [fkTaskCategory_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkTaskCategory_Task Task reference
 * @target functional.task
 */
ALTER TABLE [functional].[taskCategory]
ADD CONSTRAINT [fkTaskCategory_Task] FOREIGN KEY ([idTask])
REFERENCES [functional].[task]([idTask]);
GO

/**
 * @foreignKey fkTaskCategory_Category Category reference
 * @target functional.category
 */
ALTER TABLE [functional].[taskCategory]
ADD CONSTRAINT [fkTaskCategory_Category] FOREIGN KEY ([idCategory])
REFERENCES [functional].[category]([idCategory]);
GO

/**
 * @check chkTask_Priority Priority level validation
 * @enum {0} Low priority
 * @enum {1} Medium priority
 * @enum {2} High priority
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Priority] CHECK ([priority] BETWEEN 0 AND 2);
GO

/**
 * @check chkTask_Status Task status validation
 * @enum {0} Pending
 * @enum {1} In progress
 * @enum {2} Completed
 * @enum {3} Cancelled
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Status] CHECK ([status] BETWEEN 0 AND 3);
GO

/**
 * @check chkTask_EstimatedTime Estimated time range validation
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_EstimatedTime] CHECK ([estimatedTime] IS NULL OR ([estimatedTime] >= 5 AND [estimatedTime] <= 1440));
GO

/**
 * @default dfTask_Priority Default medium priority
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_Priority] DEFAULT (1) FOR [priority];
GO

/**
 * @default dfTask_Status Default pending status
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_Status] DEFAULT (0) FOR [status];
GO

/**
 * @default dfTask_DateCreated Auto-set creation timestamp
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_DateCreated] DEFAULT (GETUTCDATE()) FOR [dateCreated];
GO

/**
 * @default dfTask_DateModified Auto-set modification timestamp
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_DateModified] DEFAULT (GETUTCDATE()) FOR [dateModified];
GO

/**
 * @default dfTaskAttachment_DateCreated Auto-set creation timestamp
 */
ALTER TABLE [functional].[taskAttachment]
ADD CONSTRAINT [dfTaskAttachment_DateCreated] DEFAULT (GETUTCDATE()) FOR [dateCreated];
GO

/**
 * @default dfTaskTag_DateCreated Auto-set creation timestamp
 */
ALTER TABLE [functional].[taskTag]
ADD CONSTRAINT [dfTaskTag_DateCreated] DEFAULT (GETUTCDATE()) FOR [dateCreated];
GO

/**
 * @default dfCategory_Color Default blue color
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [dfCategory_Color] DEFAULT ('#3498db') FOR [color];
GO

/**
 * @default dfCategory_IsDefault Default false for custom categories
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [dfCategory_IsDefault] DEFAULT (0) FOR [isDefault];
GO

/**
 * @default dfCategory_DateCreated Auto-set creation timestamp
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [dfCategory_DateCreated] DEFAULT (GETUTCDATE()) FOR [dateCreated];
GO

/**
 * @default dfCategory_DateModified Auto-set modification timestamp
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [dfCategory_DateModified] DEFAULT (GETUTCDATE()) FOR [dateModified];
GO

/**
 * @default dfTaskCategory_DateCreated Auto-set creation timestamp
 */
ALTER TABLE [functional].[taskCategory]
ADD CONSTRAINT [dfTaskCategory_DateCreated] DEFAULT (GETUTCDATE()) FOR [dateCreated];
GO

/**
 * @index ixTask_Account Multi-tenancy filtering
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTask_Account]
ON [functional].[task]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_User User task filtering
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_User]
ON [functional].[task]([idAccount], [idUser])
INCLUDE ([title], [priority], [status], [dueDate])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_Status Status filtering
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_Status]
ON [functional].[task]([idAccount], [status])
INCLUDE ([title], [priority], [dueDate])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_Priority Priority filtering
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_Priority]
ON [functional].[task]([idAccount], [priority])
INCLUDE ([title], [status], [dueDate])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_DueDate Due date sorting
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_DueDate]
ON [functional].[task]([idAccount], [dueDate])
INCLUDE ([title], [priority], [status])
WHERE [deleted] = 0 AND [dueDate] IS NOT NULL;
GO

/**
 * @index ixTaskAttachment_Account Multi-tenancy filtering
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskAttachment_Account]
ON [functional].[taskAttachment]([idAccount]);
GO

/**
 * @index ixTaskAttachment_Account_Task Task attachment lookup
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskAttachment_Account_Task]
ON [functional].[taskAttachment]([idAccount], [idTask]);
GO

/**
 * @index ixTaskTag_Account Multi-tenancy filtering
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskTag_Account]
ON [functional].[taskTag]([idAccount]);
GO

/**
 * @index ixTaskTag_Account_Tag Tag search
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTaskTag_Account_Tag]
ON [functional].[taskTag]([idAccount], [tag]);
GO

/**
 * @index ixCategory_Account Multi-tenancy filtering
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixCategory_Account]
ON [functional].[category]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixCategory_Account_User User category filtering
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixCategory_Account_User]
ON [functional].[category]([idAccount], [idUser])
INCLUDE ([name], [color], [icon])
WHERE [deleted] = 0;
GO

/**
 * @index ixCategory_Account_Parent Hierarchy navigation
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixCategory_Account_Parent]
ON [functional].[category]([idAccount], [idParent])
INCLUDE ([name], [level])
WHERE [deleted] = 0;
GO

/**
 * @index ixCategory_Account_Node Hierarchical queries
 * @type Performance
 */
CREATE NONCLUSTERED INDEX [ixCategory_Account_Node]
ON [functional].[category]([idAccount], [node])
WHERE [deleted] = 0;
GO

/**
 * @index uqCategory_Account_Name Unique category name per account
 * @type Search
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqCategory_Account_Name]
ON [functional].[category]([idAccount], [name])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskCategory_Account Multi-tenancy filtering
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskCategory_Account]
ON [functional].[taskCategory]([idAccount]);
GO

/**
 * @index ixTaskCategory_Account_Category Category task lookup
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTaskCategory_Account_Category]
ON [functional].[taskCategory]([idAccount], [idCategory]);
GO

/**
 * @index ixTaskCategory_Account_Task Task category lookup
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTaskCategory_Account_Task]
ON [functional].[taskCategory]([idAccount], [idTask]);
GO