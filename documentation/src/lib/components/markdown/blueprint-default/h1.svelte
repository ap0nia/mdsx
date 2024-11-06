<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn } from '$lib/utils/index.js'

  let { class: className, children, ...restProps }: HTMLAttributes<HTMLHeadingElement> = $props()
</script>

<h1 class={cn('scroll-m-20 text-4xl font-bold', className)} {...restProps}>
  {@render children?.()}
</h1>
