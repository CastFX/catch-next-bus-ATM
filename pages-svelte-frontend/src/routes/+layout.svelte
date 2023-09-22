<script>
	import '../app.postcss';

	let date = new Date(new Date().toLocaleString('en-US', { timeZone: "Europe/Rome" }))
	setInterval(() => {
		date = new Date();
	}, 1000);

</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center text-neutral-content">
		<div class="">
			<h1 class="mb-5 text-5xl font-bold">Catch Next Bus ATM</h1>
			<div class="w-full flex justify-center mb-4">
				<span class="countdown text-4xl">
					<span style="--value:{date?.getHours()};"></span>:
					<span style="--value:{date?.getMinutes()};"></span>:
					<span style="--value:{date?.getSeconds()};"></span>
				</span>
			</div>
			<slot />
		</div>
	</div>
</div>
