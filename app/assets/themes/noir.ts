import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

// 黑/白单色主题：primary 映射到中性色阶
// light：近黑按钮 + 白字；dark：白按钮 + 黑字

const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}'
    },

    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',
          inverseColor: '#ffffff',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}'
        }
      },

      dark: {
        primary: {
          color: '{zinc.50}',
          inverseColor: '{zinc.950}',
          hoverColor: '{zinc.100}',
          activeColor: '{zinc.200}'
        }
      }
    }
  },

  // Aura 默认是红/蓝/绿/黄四色渐变圈，改为灰阶
  components: {
    progressspinner: {
      colorScheme: {
        light: {
          root: {
            colorOne: '{zinc.300}',
            colorTwo: '{zinc.500}',
            colorThree: '{zinc.700}',
            colorFour: '{zinc.900}'
          }
        },
        dark: {
          root: {
            colorOne: '{zinc.700}',
            colorTwo: '{zinc.500}',
            colorThree: '{zinc.300}',
            colorFour: '{zinc.100}'
          }
        }
      }
    }
  }
})

// nuxt.config 的 importTheme 需要一个 theme 配置对象（Theme.setTheme 接收 { preset }）
export default { preset: Noir }
