/**
 * @interface CategoryEntity
 * @description Represents a category entity in the system
 *
 * @property {number} idCategory - Unique category identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idUser - User who created the category
 * @property {string} name - Category name
 * @property {string} color - Category color code (hexadecimal)
 * @property {string | null} icon - Category icon identifier
 * @property {number | null} idParent - Parent category identifier
 * @property {any} node - Hierarchical node path
 * @property {number} level - Hierarchy level (0=root, 1=subcategory, 2=sub-subcategory)
 * @property {boolean} isDefault - System default category flag
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 * @property {boolean} deleted - Soft delete flag
 */
export interface CategoryEntity {
  idCategory: number;
  idAccount: number;
  idUser: number;
  name: string;
  color: string;
  icon: string | null;
  idParent: number | null;
  node: any;
  level: number;
  isDefault: boolean;
  dateCreated: Date;
  dateModified: Date;
  deleted: boolean;
}

/**
 * @interface TaskCategoryEntity
 * @description Represents a task-category association
 *
 * @property {number} idAccount - Associated account identifier
 * @property {number} idTask - Associated task identifier
 * @property {number} idCategory - Associated category identifier
 * @property {Date} dateCreated - Association creation timestamp
 */
export interface TaskCategoryEntity {
  idAccount: number;
  idTask: number;
  idCategory: number;
  dateCreated: Date;
}

/**
 * @interface CategoryListItem
 * @description Category list item with task count
 *
 * @property {number} idCategory - Category identifier
 * @property {string} name - Category name
 * @property {string} color - Category color code
 * @property {string | null} icon - Category icon identifier
 * @property {number | null} idParent - Parent category identifier
 * @property {number} level - Hierarchy level
 * @property {boolean} isDefault - System default flag
 * @property {number} taskCount - Number of active tasks
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 */
export interface CategoryListItem {
  idCategory: number;
  name: string;
  color: string;
  icon: string | null;
  idParent: number | null;
  level: number;
  isDefault: boolean;
  taskCount: number;
  dateCreated: Date;
  dateModified: Date;
}
