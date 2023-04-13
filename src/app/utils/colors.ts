export const ColorObject: ColorObjectType = {
  tile: {
    normal: {
      EMPTY: {
        outline: '#4d596f',
        fill: '#b3c2d0',
      },
      WALL: {
        outline: '#4d596f',
        fill: '#202231'
      }
    },
    highlight: {
      EMPTY: {
        outline: '#717a8c',
        fill: '#c2ced9'
      },
      WALL: {
        outline: '#4d4e5a',
        fill: '#717a8c'
      }
    }
  },
  canvas: {
    background: '#202231'
  }
}

export type TIleColoredElements = 'fill' | 'outline'

export type TileType = 'WALL' | 'EMPTY';

export const enum ColorVariants {
  normal = 'normal',
  highlight = 'highlight',
}

export type ColorObjectType = {
  tile: {
    [key in ColorVariants]: {
      [key in TileType]: {
        [key in TIleColoredElements]: string
      }
    }
  },
  canvas: {
    background: string
  }
}
