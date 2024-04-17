export const download = (filename: string, type: string, data: string) => {
	const link = document.createElement('a');
	link.setAttribute('href', `data:${type};charset=utf-8,${encodeURI(data)}`);
	link.setAttribute('download', filename);

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
