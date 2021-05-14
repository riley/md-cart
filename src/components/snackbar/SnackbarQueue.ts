let currentSnackbar: any
let timeout: number | undefined

function createPromise (duration: number, context: any) {
  return new Promise<void>(resolve => {
    currentSnackbar = {
      destroy: () => {
        currentSnackbar = null
        resolve()
      }
    }

    if (duration !== Infinity) {
      timeout = window.setTimeout(() => {
        destroySnackbar()
        context._vnode.componentInstance.initDestroy(true)
      }, duration)
    }
  })
}

export const createSnackbar = async (duration: number, context: any) => {
  if (currentSnackbar) {
    await destroySnackbar()
    return createPromise(duration, context)
  }
}

export const destroySnackbar = () => {
  return new Promise<void>(resolve => {
    if (currentSnackbar) {
      window.clearTimeout(timeout)
      currentSnackbar.destroy()
      setTimeout(resolve, 400)
    } else {
      resolve()
    }
  })
}
