import { PreviosService } from "@api/previos";
import { MuestrasService } from "@api/muestras";
import { FrutosService } from "@api/frutos";
import { CentrosFrutalesService } from "@api/centros_frutales";
import DeviceStorage from "@utils/deviceStorage";
//@ts-ignore
import { StorageInterface } from "@types/Components";

export class PreviosController {
	private previosService: PreviosService;
	private cacheService: StorageInterface;
	private muestrasService: MuestrasService;
	private frutosService: FrutosService;
	private centrosFrutalesService: CentrosFrutalesService;

	constructor(
		previosService: PreviosService,
		cacheService: StorageInterface,
		muestrasService: MuestrasService,
		frutosService: FrutosService,
		centrosFrutalesService: CentrosFrutalesService,
	) {
		if (!previosService)
			throw new Error("Invalid parameter: previosService is required.");
		if (!cacheService)
			throw new Error("Invalid parameter: cacheService is required.");
		this.previosService = previosService;
		this.cacheService = cacheService;
		this.muestrasService = muestrasService;
		this.frutosService = frutosService;
		this.centrosFrutalesService = centrosFrutalesService;
	}

	async getPreviosByCompanyIdWithCache(
		companyId: string,
		select: string | string[] = "*",
	): Promise<any[]> {
		if (typeof companyId !== "string" || companyId.trim() === "")
			throw new Error(
				"Invalid parameter: companyId must be a non-empty string.",
			);
		try {
			const cacheKey = `previos_company_${companyId}`;
			const cached = this.cacheService.getItem(cacheKey, "string");
			if (cached) {
				const parsed = JSON.parse(cached);
				if (Array.isArray(parsed)) return parsed;
			}
			const data = await this.previosService.fetchPreviosByCompanyId(
				companyId,
				select,
			);
			this.cacheService.setItem(cacheKey, JSON.stringify(data));
			return data;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async getPreviosByCompanyIdAllWithCache(companyId: string): Promise<any[]> {
		if (typeof companyId !== "string" || companyId.trim() === "")
			throw new Error(
				"Invalid parameter: companyId must be a non-empty string.",
			);
		try {
			console.log(companyId);
			const cacheKey = `previos_company_all_${companyId}`;
			// const cached = this.cacheService.getItem(cacheKey, "string");
			// if (cached) {
			// 	const parsed = JSON.parse(cached);
			// 	console.log("parsed", parsed);
			// 	if (Array.isArray(parsed)) return parsed;
			// }
			const data =
				await this.previosService.fetchPreviosByCompanyIdAll(companyId);
			this.cacheService.setItem(cacheKey, JSON.stringify(data));
			return data;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async getPrevioByIdWithCache(
		previoId: string,
		select: string | string[] = "*",
	): Promise<any> {
		if (typeof previoId !== "string" || previoId.trim() === "")
			throw new Error(
				"Invalid parameter: previoId must be a non-empty string.",
			);
		try {
			const cacheKey = `previo_${previoId}`;
			const cached = this.cacheService.getItem(cacheKey, "string");
			if (cached) {
				const parsed = JSON.parse(cached);
				if (parsed !== null) return parsed;
			}
			const data = await this.previosService.fetchPrevioById(previoId, select);
			this.cacheService.setItem(cacheKey, JSON.stringify(data));
			return data;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async getPrevioByIdAllWithCache(previoId: string): Promise<any> {
		if (typeof previoId !== "string" || previoId.trim() === "")
			throw new Error(
				"Invalid parameter: previoId must be a non-empty string.",
			);
		try {
			const cacheKey = `previo_all_${previoId}`;
			const cached = this.cacheService.getItem(cacheKey, "string");
			if (cached) {
				const parsed = JSON.parse(cached);
				if (parsed !== null) return parsed;
			}
			const data = await this.previosService.fetchPrevioByIdAll(previoId);
			this.cacheService.setItem(cacheKey, JSON.stringify(data));
			return data;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async updatePrevioByIdWithCache(
		previoId: string,
		updates: Record<string, any>,
	): Promise<{ success: boolean }> {
		if (typeof previoId !== "string" || previoId.trim() === "")
			throw new Error(
				"Invalid parameter: previoId must be a non-empty string.",
			);
		if (!updates || typeof updates !== "object")
			throw new Error("Invalid parameter: updates must be an object.");
		try {
			const result = await this.previosService.updatePrevioById(
				previoId,
				updates,
			);
			const cacheKey1 = `previo_${previoId}`;
			const cacheKey2 = `previo_all_${previoId}`;
			if (typeof this.cacheService.removeItem === "function") {
				this.cacheService.removeItem(cacheKey1);
				this.cacheService.removeItem(cacheKey2);
			} else {
				this.cacheService.setItem(cacheKey1, "");
				this.cacheService.setItem(cacheKey2, "");
			}
			return result;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async deletePrevioByIdWithCache(
		previoId: string,
	): Promise<{ success: boolean }> {
		if (typeof previoId !== "string" || previoId.trim() === "")
			throw new Error(
				"Invalid parameter: previoId must be a non-empty string.",
			);
		try {
			const result = await this.previosService.deletePrevioById(previoId);
			const cacheKey1 = `previo_${previoId}`;
			const cacheKey2 = `previo_all_${previoId}`;
			if (typeof this.cacheService.removeItem === "function") {
				this.cacheService.removeItem(cacheKey1);
				this.cacheService.removeItem(cacheKey2);
			} else {
				this.cacheService.setItem(cacheKey1, "");
				this.cacheService.setItem(cacheKey2, "");
			}
			return result;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async enrichPrevio(previo: any): Promise<any> {
		if (!previo || !previo.id)
			throw new Error("Invalid previo data for enrichment.");
		try {
			const muestras = await this.muestrasService.fetchMuestrasByPrevioIdAll(
				previo.id,
			);
			const enrichedMuestras = await Promise.all(
				muestras.map(async (muestra: any) => {
					const enrichedMuestra: any = { ...muestra };
					if (muestra.fruto_id) {
						enrichedMuestra.fruto = await this.frutosService.fetchFrutoById(
							muestra.fruto_id,
						);
					}
					if (muestra.centro_frutal_id) {
						enrichedMuestra.centro_frutal =
							await this.centrosFrutalesService.fetchCentroFrutalById(
								muestra.centro_frutal_id,
							);
					}
					return enrichedMuestra;
				}),
			);
			return { ...previo, muestras: enrichedMuestras };
		} catch (error: any) {
			console.error("Error enriching previo:", error);
			throw error;
		}
	}

	async getCompletePreviosByCompanyIdAllWithCache(
		companyId: string,
	): Promise<any[]> {
		if (typeof companyId !== "string" || companyId.trim() === "")
			throw new Error(
				"Invalid parameter: companyId must be a non-empty string.",
			);
		try {
			const previos = await this.getPreviosByCompanyIdAllWithCache(companyId);
			const enrichedPrevios = await Promise.all(
				previos.map(async (previo: any) => {
					return await this.enrichPrevio(previo);
				}),
			);
			return enrichedPrevios;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async createPrevioByCompanyIdWithCache(
		companyId: string,
		name: string,
		date: string,
	) {
		try {
			console.log(companyId, name, date);
			const previoResult = await this.previosService.createPrevioByCompanyId(
				companyId,
				name,
				date,
			);

			const fetchPrevioDetailsWithRetry = async (
				retries: number,
				delay: number,
			) => {
				try {
					await new Promise((resolve) => setTimeout(resolve, delay));

					const result = await this.getPrevioByIdAllWithCache(
						previoResult.previo_id,
					);

					if (!result || result[0] || result[0].nombre || result[0].id) {
						throw new Error("Invalid previo data returned.");
					}

					console.log(result);

					return result;
				} catch (error) {
					if (retries > 0) {
						console.warn(`Retrying... (${retries} retries left)`);
						return fetchPrevioDetailsWithRetry(retries - 1, delay);
					} else {
						throw error;
					}
				}
			};

			const previoDetails = await fetchPrevioDetailsWithRetry(2, 2000);
			return previoDetails;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async createMuestraByPrevioIdWithCache(previoId: string) {
		try {
			const muestraResult =
				await this.muestrasService.createMuestraByPrevioId(previoId);

			console.log("muestraResult", muestraResult);

			const fetchMuestraDetailsWithRetry = async (
				retries: number,
				delay: number,
			) => {
				try {
					await new Promise((resolve) => setTimeout(resolve, delay));

					const result = await this.muestrasService.fetchMuestraById(
						muestraResult.muestra_id,
					);

					// if (!result || !result[0] || result[0].id) {
					// 	throw new Error("Invalid muestra data returned.");
					// }

					return result;
				} catch (error) {
					if (retries > 0) {
						console.warn(`Retrying... (${retries} retries left)`);
						return fetchMuestraDetailsWithRetry(retries - 1, delay);
					} else {
						throw error;
					}
				}
			};

			const muestraDetails = await fetchMuestraDetailsWithRetry(2, 2000);
			return muestraDetails;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}
}

export const PreviosControllerSupabase = new PreviosController(
	new PreviosService(),
	DeviceStorage,
	new MuestrasService(),
	new FrutosService(),
	new CentrosFrutalesService(),
);
