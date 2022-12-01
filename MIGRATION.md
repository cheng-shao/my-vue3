
## 迁移指南[https://v3-migration.vuejs.org/]


- `src`目录下`utils、api以及view/components`里的方法和组件无需导入，可直接使用.
- 过滤器（已废弃）`filters` 已迁移至`src/utils`里.
- Lockr使用如：`Lockr.get()`改为`get()`
- 