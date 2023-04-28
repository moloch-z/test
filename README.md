## 搭建过程

参考文章：

- [工欲善其事必先利其器（搭建组件库](https://juejin.cn/post/7221409486697709629)
- [Monorepo 基于 gulp+rollup 打包简析](https://juejin.cn/post/7225161813704097847)

## pnpm-workspace 基础使用

- `-w` 指令表示安装至 `workspaceRoot` 下
- `--filter` or `-F` 指令表示安装至指定模块下

## 新增 workspace 模块

在 `packages` 文件夹新建新的模块文件夹，`cd` 至新建模块，执行 `npm init --scope=<your_org_name>` 初始化 `package.json`，模块命名以 `@umi-meta/` 开头，如 `npm init --scope=@umi-meta`

## workspace 模块引用

`@umi-meta/components` 模块引用 `@umi-meta/utils` 模块

```sh
pnpm i -S @umi-meta/utils --filter @umi-meta/components
```

## release 工作流

有新的流程添加可在 `scripts` 模块内修改 `.sh` 脚本

## 目录结构

## 打包

打包到 `umi-meta` 下统一发布

### ts 模块打包

### style 打包

### 总包

### 发布
