export let PDF = function(myalltimes, project, user){
	let pdfdoc = "";
	pdfdoc = `<div style='padding:1in;text-align:center;font-family:Helvetica, Arial, sans-serif;font-size:1.4rem;'>
				<h2>${project}</h2>
				<table style='border: 1px solid black; width:100%; border-collapse:collapse;'>
	                <thead>
	                    <tr>
	                        <th style='border: 1px solid black;padding:1rem;'>User Name</th>
	                        <th style='border: 1px solid black;padding:1rem;'>Date & Time Started</th>
	                        <th style='border: 1px solid black;padding:1rem;'>Date & Time Ended</th>
	                        <th style='border: 1px solid black;padding:1rem;'>Total Time</th>
	                    </tr>
	                </thead>
	                <tbody>`;
	myalltimes.map((mytime) => {
        pdfdoc +=   `<tr>
		                <td style='border: 1px solid black;text-align:center;padding:1rem;'>${fixName(user)}</td>
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
fixName = function(name){
	for(let a = 0; a < name.length; a++){
		if(name[a] !== undefined){
			return name[a];
		}
	}
}