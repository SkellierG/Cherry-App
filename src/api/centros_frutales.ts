import { supabase } from "@services/supabase";

export class CentrosFrutalesService {
	async fetchCentrosFrutalesByMuestraId(
		muestraId: string,
		select: string | string[] = "*",
	): Promise<any> {
		if (!muestraId) throw new Error("Invalid muestra_id provided");

		try {
			const { data: muestraData, error: muestraError } = await supabase
				.from("muestras")
				.select("centro_frutal_id")
				.eq("id", muestraId)
				.single()
				.setHeader("Accept", "application/json");

			if (muestraError) throw muestraError;
			if (!muestraData || !muestraData.centro_frutal_id) return null;

			const centroFrutalId = muestraData.centro_frutal_id;

			const { data, error } = await supabase
				.from("centros_frutales")
				.select(typeof select === "string" ? select : select.join(","))
				.eq("id", centroFrutalId)
				.single()
				.setHeader("Accept", "application/json");

			if (error) throw error;

			return data || null;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async fetchCentroFrutalById(
		centroFrutalId: string,
		select: string | string[] = "*",
	): Promise<any> {
		if (!centroFrutalId) throw new Error("Invalid centro_frutal_id provided");

		try {
			const { data, error } = await supabase
				.from("centros_frutales")
				.select(typeof select === "string" ? select : select.join(","))
				.eq("id", centroFrutalId)
				.single()
				.setHeader("Accept", "application/json");

			if (error) throw error;

			return data;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async fetchCentrosFrutalesByMuestraIdAll(muestraId: string): Promise<any[]> {
		if (!muestraId) throw new Error("Invalid muestra_id provided");

		try {
			const data = await this.fetchCentrosFrutalesByMuestraId(muestraId);
			return data ? [data] : [];
		} catch (error: any) {
			throw error;
		}
	}

	async fetchCentroFrutalByIdAll(centroFrutalId: string): Promise<any> {
		if (!centroFrutalId) throw new Error("Invalid centro_frutal_id provided");

		try {
			const data = await this.fetchCentroFrutalById(centroFrutalId);
			return data;
		} catch (error: any) {
			throw error;
		}
	}

	async updateCentroFrutalById(
		centroFrutalId: string,
		updates: Record<string, any>,
	): Promise<{ success: boolean }> {
		if (!centroFrutalId || !updates || typeof updates !== "object") {
			throw new Error("Invalid centro_frutal_id or updates provided");
		}

		try {
			const { error } = await supabase
				.from("centros_frutales")
				.update(updates)
				.eq("id", centroFrutalId)
				.single()
				.setHeader("Accept", "application/json");

			if (error) throw error;

			return { success: true };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async deleteCentroFrutalById(
		centroFrutalId: string,
	): Promise<{ success: boolean }> {
		if (!centroFrutalId) throw new Error("Invalid centro_frutal_id provided");

		try {
			const { error } = await supabase
				.from("centros_frutales")
				.delete()
				.eq("id", centroFrutalId)
				.setHeader("Accept", "application/json");

			if (error) throw error;

			return { success: true };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}
}
