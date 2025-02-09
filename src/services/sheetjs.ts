// import * as XLSX from "xlsx";
// import * as FileSystem from "expo-file-system";
// import { StorageAccessFramework } from "expo-file-system";

// /**
//  * Reads an XLSX or CSV file and returns a Workbook (for XLSX) or a Worksheet (for CSV).
//  * @param uri - File path.
//  * @param type - File type ("xlsx" or "csv").
//  * @returns A Workbook (for XLSX) or a Worksheet (for CSV).
//  */
// export async function readSheetFile(
// 	uri: string,
// 	type: "xlsx" | "csv",
// ): Promise<XLSX.WorkBook | XLSX.WorkSheet> {
// 	try {
// 		// Read file content as base64 string
// 		const fileContent = await FileSystem.readAsStringAsync(uri, {
// 			encoding: FileSystem.EncodingType.Base64,
// 		});

// 		if (type === "xlsx") {
// 			// Parse base64 string into a Workbook for XLSX
// 			const workbook: XLSX.WorkBook = XLSX.read(fileContent, {
// 				type: "base64",
// 			});
// 			return workbook;
// 		} else if (type === "csv") {
// 			// Read file content as UTF-8 string for CSV
// 			const csvString: string = await FileSystem.readAsStringAsync(uri, {
// 				encoding: FileSystem.EncodingType.UTF8,
// 			});
// 			// Convert CSV string to Worksheet
// 			const worksheet: XLSX.WorkSheet = csvToSheet(csvString);
// 			return worksheet;
// 		} else {
// 			throw new Error("Unsupported file type. Use 'xlsx' or 'csv'.");
// 		}
// 	} catch (error) {
// 		console.error("Error reading file:", error);
// 		throw error;
// 	}
// }

// /**
//  * Writes data to a file in XLSX or CSV format.
//  * @param data - Workbook (for XLSX) or Worksheet (for CSV).
//  * @param fileName - Output file name.
//  * @param type - File type ("xlsx" or "csv").
//  */
// export async function writeSheetFile(
// 	data: XLSX.WorkBook,
// 	fileName: string,
// 	type: "xlsx" | "csv",
// ): Promise<void> {
// 	try {
// 		const fileUri: string = `${FileSystem.documentDirectory}${fileName}`;

// 		if (type === "xlsx") {
// 			// Convert Workbook to base64 and write as XLSX
// 			const b64write: string = XLSX.write(data, {
// 				type: "base64",
// 				bookType: "xlsx",
// 			});
// 			await FileSystem.writeAsStringAsync(fileUri, b64write, {
// 				encoding: FileSystem.EncodingType.Base64,
// 			});
// 		} else if (type === "csv") {
// 			// Convert Worksheet to CSV string and write as CSV
// 			const csvString: string = XLSX.utils.sheet_to_csv(data);
// 			await FileSystem.writeAsStringAsync(fileUri, csvString, {
// 				encoding: FileSystem.EncodingType.UTF8,
// 			});
// 		} else {
// 			throw new Error("Unsupported file type. Use 'xlsx' or 'csv'.");
// 		}

// 		console.log(`${type.toUpperCase()} file saved at:`, fileUri);
// 	} catch (error) {
// 		console.error("Error writing file:", error);
// 		throw error;
// 	}
// }

// /**
//  * Converts a CSV string into a Worksheet.
//  * @param csvString - The CSV file content as a string.
//  * @returns A Worksheet ready to be processed.
//  */
// function csvToSheet(csvString: string): XLSX.WorkSheet {
// 	const rows: string[][] = csvString.split("\n").map((line) => line.split(",")); // Split lines and columns.
// 	return XLSX.utils.aoa_to_sheet(rows); // Convert array of arrays into a worksheet.
// }

// /**
//  * Requests user permissions to access a specific directory.
//  * @returns Directory access permissions.
//  */
// export async function requestPermissions(): Promise<FileSystem.FileSystemRequestDirectoryPermissionsResult> {
// 	const perms = await StorageAccessFramework.requestDirectoryPermissionsAsync();
// 	if (!perms.granted) {
// 		throw new Error("Directory permissions not granted.");
// 	}
// 	return perms;
// }

import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";

/**
 * Reads an XLSX or CSV file and returns a Workbook (for XLSX) or a Worksheet (for CSV).
 * @param uri - File path.
 * @param type - File type ("xlsx" or "csv").
 * @returns A Workbook (for XLSX) or a Worksheet (for CSV).
 */
export async function readSheetFile(
	uri: string,
	type: "xlsx" | "csv",
): Promise<XLSX.WorkBook | XLSX.WorkSheet> {
	try {
		// Read file content as base64 string
		const fileContent = await FileSystem.readAsStringAsync(uri, {
			encoding: FileSystem.EncodingType.Base64,
		});

		if (type === "xlsx") {
			// Parse base64 string into a Workbook for XLSX
			const workbook: XLSX.WorkBook = XLSX.read(fileContent, {
				type: "base64",
			});
			return workbook;
		} else if (type === "csv") {
			// Read file content as UTF-8 string for CSV
			const csvString: string = await FileSystem.readAsStringAsync(uri, {
				encoding: FileSystem.EncodingType.UTF8,
			});
			// Convert CSV string to Worksheet
			const worksheet: XLSX.WorkSheet = csvToSheet(csvString);
			return worksheet;
		} else {
			throw new Error("Unsupported file type. Use 'xlsx' or 'csv'.");
		}
	} catch (error) {
		console.error("Error reading file:", error);
		throw error;
	}
}

/**
 * Writes data to a file in XLSX or CSV format.
 * Allows the user to choose the directory in which to save the file.
 * @param data - Workbook (for XLSX) or Worksheet (for CSV).
 * @param fileName - Output file name.
 * @param type - File type ("xlsx" or "csv").
 */
export async function writeSheetFile(
	data: XLSX.WorkBook,
	fileName: string,
	type: "xlsx" | "csv",
): Promise<void> {
	try {
		// Solicitar al usuario permisos y que elija un directorio
		const perms =
			await StorageAccessFramework.requestDirectoryPermissionsAsync();
		if (!perms.granted) {
			throw new Error("Directory permissions not granted.");
		}
		const directoryUri = perms.directoryUri;

		// Determinar el MIME type según el tipo de archivo
		let mimeType = "";
		if (type === "xlsx") {
			mimeType =
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
		} else if (type === "csv") {
			mimeType = "text/csv";
		}

		// Crear el archivo en el directorio seleccionado
		const fileUri: string = await StorageAccessFramework.createFileAsync(
			directoryUri,
			fileName,
			mimeType,
		);

		if (type === "xlsx") {
			// Convertir Workbook a base64 y escribir como XLSX
			const b64write: string = XLSX.write(data, {
				type: "base64",
				bookType: "xlsx",
			});
			await FileSystem.writeAsStringAsync(fileUri, b64write, {
				encoding: FileSystem.EncodingType.Base64,
			});
		} else if (type === "csv") {
			// Convertir Worksheet a CSV string y escribir como CSV
			const csvString: string = XLSX.utils.sheet_to_csv(data);
			await FileSystem.writeAsStringAsync(fileUri, csvString, {
				encoding: FileSystem.EncodingType.UTF8,
			});
		}

		console.log(`${type.toUpperCase()} file saved at:`, fileUri);
	} catch (error) {
		console.error("Error writing file:", error);
		throw error;
	}
}

/**
 * Converts a CSV string into a Worksheet.
 * @param csvString - The CSV file content as a string.
 * @returns A Worksheet ready to be processed.
 */
function csvToSheet(csvString: string): XLSX.WorkSheet {
	const rows: string[][] = csvString.split("\n").map((line) => line.split(",")); // Split lines and columns.
	return XLSX.utils.aoa_to_sheet(rows); // Convert array of arrays into a worksheet.
}

/**
 * Requests user permissions to access a specific directory.
 * @returns Directory access permissions.
 */
export async function requestPermissions(): Promise<FileSystem.FileSystemRequestDirectoryPermissionsResult> {
	const perms = await StorageAccessFramework.requestDirectoryPermissionsAsync();
	if (!perms.granted) {
		throw new Error("Directory permissions not granted.");
	}
	return perms;
}
