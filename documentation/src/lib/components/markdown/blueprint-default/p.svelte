<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  let { children, ...restProps }: HTMLAttributes<HTMLParagraphElement> = $props()
</script>

<p {...restProps}>
  {@render children?.()}
</p>
