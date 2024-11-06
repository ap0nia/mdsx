<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn } from '$lib/utils/index.js'

  let { class: className, children, ...restProps }: HTMLAttributes<HTMLHeadingElement> = $props()
</script>

<h4 class={cn('scroll-m-20 text-lg font-bold tracking-tight', className)} {...restProps}>
  {@render children?.()}
</h4>
