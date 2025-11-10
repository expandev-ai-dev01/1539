/**
 * @load category
 */
INSERT INTO [functional].[category]
([idAccount], [idUser], [name], [color], [icon], [idParent], [node], [isDefault], [dateCreated], [dateModified], [deleted])
VALUES
(1, 1, 'Trabalho', '#3498db', 'briefcase', NULL, '/1/', 1, GETUTCDATE(), GETUTCDATE(), 0),
(1, 1, 'Pessoal', '#2ecc71', 'user', NULL, '/2/', 1, GETUTCDATE(), GETUTCDATE(), 0),
(1, 1, 'Estudo', '#9b59b6', 'book', NULL, '/3/', 1, GETUTCDATE(), GETUTCDATE(), 0),
(1, 1, 'Saúde', '#e74c3c', 'heart', NULL, '/4/', 1, GETUTCDATE(), GETUTCDATE(), 0),
(1, 1, 'Finanças', '#f39c12', 'dollar-sign', NULL, '/5/', 1, GETUTCDATE(), GETUTCDATE(), 0),
(1, 1, 'Outros', '#95a5a6', 'folder', NULL, '/6/', 1, GETUTCDATE(), GETUTCDATE(), 0);
GO