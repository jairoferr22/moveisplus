import { ReactNode } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

declare module 'react' {
  interface ReactElement {
    type: any
    props: any
    key: any | null
  }
} 