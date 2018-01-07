export let PDF = function(result){
	let pdfdoc = "";
	pdfdoc = `<div style='padding:1in;text-align:center;font-family:Helvetica, Arial, sans-serif;font-size:1.4rem;'>
				<h2>Users Activities</h2>
				<table style='width:100%; border-collapse:collapse;'>
	                <thead>
	                    <tr>
	                        <th style='border: 1px solid black;padding:1rem;'>Project Name</th>
	                        <th style='border: 1px solid black;padding:1rem;'>User Name</th>
	                        <th style='border: 1px solid black;padding:1rem;'>Date</th>
	                        <th style='border: 1px solid black;padding:1rem;'>Total Time</th>
	                    </tr>
	                </thead>
	                <tbody>`;
	result.map((mytime) => {
        pdfdoc +=   `<tr>
		                <td style='border: 1px solid black;text-align:center;padding:1rem;'>${mytime.project.label}</td>
		                <td style='border: 1px solid black;text-align:center;padding:1rem;'>${fixName(mytime.user)}</td>
		                <td style='border: 1px solid black;text-align:center;padding:1rem;'>${mytime.dateStarted}</td>
		                <td style='border: 1px solid black;text-align:center;padding:1rem;'>${formatTime(mytime.totalTime)}</td>
		            </tr>`;
        });
	pdfdoc += `</tbody>
			</table>
			</div>`;

	return pdfdoc;
}

formatTime = function(time){
    return moment("1900/01/01 00:00:00").add(time, 'seconds').format("HH:mm:ss");
}
fixName = function(name){
	for(let a = 0; a < name.length; a++){
		if(name[a] !== undefined){
			return name[a];
		}
	}
}