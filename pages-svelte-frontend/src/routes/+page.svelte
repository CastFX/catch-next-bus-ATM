<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>ATM Bus Estimates</h1>

{#each data.lineStops as lineStop}
  <p>{JSON.stringify(lineStop)}</p>
{/each}

