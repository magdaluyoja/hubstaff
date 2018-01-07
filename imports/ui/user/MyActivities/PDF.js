export let PDF = function(mytimes){
	let pdfdoc = "";
	pdfdoc = `<div style='padding:1in;text-align:center;font-family:Helvetica, Arial, sans-serif;font-size:1.4rem;'>
				<h2>My Activities</h2>
				<table style='border: 1px solid black; width:100%; border-collapse:collapse;'>
	                <thead>
	                    <tr>
	                        <th style='border: 1px solid black;padding:1rem;'>Project Name</th>
	                        <th style='border: 1px solid black;padding:1rem;'>Date & Time Started</th>
	                        <th style='border: 1px solid black;padding:1rem;'>Date & Time Ended</th>
	                        <th style='border: 1px solid black;padding:1rem;'>Total Time</th>
	                    </tr>
	                </thead>
	                <tbody>`;
	mytimes.map((mytime) => {
        pdfdoc +=   `<tr>
		                <td style='border: 1px solid black;text-align:center;padding:1rem;'>${mytime.project.label}</td>
		                <td style='border: 1px solid black;text-align:center;padding:1rem;'>${mytime.dateStarted} ${mytime.timeStarted}</td>
		                <td style='border: 1px solid black;text-align:center;padding:1rem;'>${mytime.dateEnded} ${mytime.timeEnded}</td>
		                <td style='border: 1px solid black;text-align:center;padding:1rem;'>${mytime.totalTime}</td>
		            </tr>`;
        });
	pdfdoc += `</tbody>
			</table>
			</div>`;

	return pdfdoc;
}