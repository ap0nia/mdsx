<script lang="ts" module>
  export {
    a,
    blockquote,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    hr,
    img,
    li,
    ol,
    p,
    pre,
    table,
    td,
    th,
    tr,
    ul,
  } from './index'
</script>

<script lang="ts">
  import type { Snippet } from 'svelte'

  type $$Props = {
    children?: Snippet<[any]>

    [key: string]: any
  }

  let { children, ...props }: $$Props = $props()
</script>

{@render children?.(props)}
