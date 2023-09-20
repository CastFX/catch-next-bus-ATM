<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="flex flex-wrap flex-row justify-center">
	{#each Object.entries(data.lineStops) as [stop, lines]}
		<div class="card w-96 bg-base-100 shadow-xl ml-2 mb-2">
			<div class="card-body">
				<h2 class="card-title justify-center">
					{stop}
				</h2>
				<div class="card-actions justify-center">
					{#each lines as line}
						<p>{line.lineId}{line.direction ? '↑' : '↓'}</p>
					{/each}
				</div>
				<div class="card-actions justify-center">
					{#each lines[0].minutesFromHome as velocity}
						<p>{velocity.type}: {velocity.minutes} minutes</p>
					{/each}
				</div>
			</div>
		</div>
	{/each}
</div>
