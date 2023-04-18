export const ColorObject: ColorObjectType = {
  tile: {
    EMPTY: {
      none: {
        outline: {
          normal: '#4d596f',
          highlight: '#717a8c',
        },
        fill: {
          normal: '#b3c2d0',
          highlight: '#c2ced9'
        },
      },
      start: {
        outline: {
          normal: '#4d596f',
          highlight: '#717a8c',
        },
        fill: {
          normal: '#08a14c',
          highlight: '#29cc72'
        },
      },
      end: {
        outline: {
          normal: '#4d596f',
          highlight: '#717a8c',
        },
        fill: {
          normal: '#942637',
          highlight: '#b03e4f'
        },
      }
    },
    WALL: {
      outline: {
        normal: '#4d596f',
        highlight: '#4d4e5a',
      },
      fill: {
        normal: '#202231',
        highlight: '#717a8c',
      }
    }
  },
  canvas: {
    background: "#202231"
  }
}

export type TIleColoredElements = 'fill' | 'outline'

export type TileType = 'WALL' | 'EMPTY';

export type TileFlag = 'none' | 'start' | 'end';

export const enum ColorVariants {
  normal = 'normal',
  highlight = 'highlight',
}

export type ColorObjectType = {
  tile: {
    EMPTY: {
      [key in TileFlag]: {
        [key in TIleColoredElements]: {
          [key in ColorVariants]: string
        }
      }
    },
    WALL: {
      [key in TIleColoredElements]: {
        [key in ColorVariants]: string
      }
    },
  },
  canvas: {
    background: string
  }
}


