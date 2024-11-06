# Demonstration

This is a Svelte file with twoslash!

```svelte
<script lang="ts">
  console.log('hello')

  let count = $state(0)
</script>

<div>
  <p>{count}</p>
  <button onclick={() => count++}>Increment</button>
</div>
```

This is a TS file with twoslash.

```ts
console.log('hello')

let count = 0

console.log({ count })
```

Svelte file with a persisted twoslash query.

```svelte
<script lang="ts">
  console.log('hello')

  let count = $state(0)
  //           ^?
</script>

<div>
  <p>{count}</p>
  <button onclick={() => count++}>Increment</button>
</div>
```
