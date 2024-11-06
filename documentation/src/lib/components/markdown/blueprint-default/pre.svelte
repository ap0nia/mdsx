<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  let { children, ...restProps }: HTMLAttributes<HTMLPreElement> = $props()
</script>

<pre {...restProps}>{@render children?.()}</pre>
