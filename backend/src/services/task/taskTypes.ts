/**
 * @interface TaskEntity
 * @description Represents a task entity in the system
 *
 * @property {number} idTask - Unique task identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idUser - User who created the task
 * @property {string} title - Task title
 * @property {string | null} description - Task description
 * @property {Date | null} dueDate - Task due date
 * @property {TaskPriority} priority - Task priority level
 * @property {number | null} estimatedTime - Estimated completion time in minutes
 * @property {string | null} recurrenceConfig - JSON recurrence configuration
 * @property {TaskStatus} status - Current task status
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 * @property {boolean} deleted - Soft delete flag
 */
export interface TaskEntity {
  idTask: number;
  idAccount: number;
  idUser: number;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: TaskPriority;
  estimatedTime: number | null;
  recurrenceConfig: string | null;
  status: TaskStatus;
  dateCreated: Date;
  dateModified: Date;
  deleted: boolean;
}

/**
 * @enum TaskPriority
 * @description Task priority levels
 */
export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

/**
 * @enum TaskStatus
 * @description Task status values
 */
export enum TaskStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
}

/**
 * @interface TaskAttachmentEntity
 * @description Represents a task file attachment
 *
 * @property {number} idTaskAttachment - Unique attachment identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idTask - Associated task identifier
 * @property {string} fileName - Original file name
 * @property {number} fileSize - File size in bytes
 * @property {string} fileType - File MIME type
 * @property {string} filePath - Storage path
 * @property {Date} dateCreated - Upload timestamp
 */
export interface TaskAttachmentEntity {
  idTaskAttachment: number;
  idAccount: number;
  idTask: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  dateCreated: Date;
}

/**
 * @interface TaskTagEntity
 * @description Represents a task categorization tag
 *
 * @property {number} idAccount - Associated account identifier
 * @property {number} idTask - Associated task identifier
 * @property {string} tag - Tag value
 * @property {Date} dateCreated - Creation timestamp
 */
export interface TaskTagEntity {
  idAccount: number;
  idTask: number;
  tag: string;
  dateCreated: Date;
}

/**
 * @interface RecurrenceConfig
 * @description Configuration for recurring tasks
 *
 * @property {RecurrenceType} type - Recurrence type
 * @property {number} interval - Recurrence interval
 * @property {Date | number} end - End date or number of occurrences
 */
export interface RecurrenceConfig {
  type: RecurrenceType;
  interval: number;
  end: Date | number;
}

/**
 * @enum RecurrenceType
 * @description Types of task recurrence
 */
export enum RecurrenceType {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}
