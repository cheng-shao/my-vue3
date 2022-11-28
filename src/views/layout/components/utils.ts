import path from 'path-browserify'

/**
 * 通过路由获取导航信息
 * path 用与标记
 * fullPath  用与跳转
 */
export function getNavMenus(routers) {
  const menus = []
  routers.forEach((item, index) => {
    const { result, onlyOneChild } = hasOneShowingChild(item.children, item)
    if (!item.hidden && result) {
      const fullPath = resolvePath(onlyOneChild.path, item.path)
      let path = fullPath
      if (fullPath.includes('/subs/')) {
        path = fullPath.split('/subs/')[0]
      }
      menus.push({
        label: onlyOneChild.meta.title,
        icon: onlyOneChild.meta.icon || (item.meta && item.meta.icon),
        num: onlyOneChild.meta.num,
        count: onlyOneChild.count,
        path: path,
        fullPath: resolvePath(onlyOneChild.path, item.path),
        index
      })
    }
  })
  return menus
}

function hasOneShowingChild(children = [], parent) {
  let onlyOneChild = null

  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild = item
      return true
    }
  })

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return {
      result: true,
      onlyOneChild: onlyOneChild
    }
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild = { ...parent, path: '', noShowingChildren: true }
    return {
      result: true,
      onlyOneChild: onlyOneChild
    }
  }

  if (showingChildren.length > 1) {
    return {
      result: true,
      onlyOneChild: {
        ...showingChildren[0],
        meta: parent.meta
      }
    }
  }

  return {
    result: false,
    onlyOneChild: null
  }
}

function resolvePath(routePath, baseUrl) {
  if (isExternalUrl(routePath)) {
    return routePath
  }
  if (isExternalUrl(baseUrl)) {
    return baseUrl
  }
  return path.resolve(baseUrl, routePath)
}
