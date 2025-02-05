import { supabase } from "@services/supabase";

export class FrutosService {
	async fetchFrutoByMuestraId(
		muestraId: string,
		select: string | string[] = "*",
	): Promise<any> {
		if (!muestraId) throw new Error("Invalid muestra_id provided");

		try {
			const { data: muestraData, error: muestraError } = await supabase
				.from("muestras")
				.select("fruto_id")
				.eq("id", muestraId)
				.single()
				.setHeader("Accept", "application/json");

			if (muestraError) throw muestraError;
			if (!muestraData || !muestraData.fruto_id) return null;

			const frutoId = muestraData.fruto_id;

			const { data, error } = await supabase
				.from("frutos")
				.select(typeof select === "string" ? select : select.join(","))
				.eq("id", frutoId)
				.single()
				.setHeader("Accept", "application/json");

			if (error) throw error;

			return data || null;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async fetchFrutoById(
		frutoId: string,
		select: string | string[] = "*",
	): Promise<any> {
		if (!frutoId) throw new Error("Invalid fruto_id provided");

		try {
			const { data, error } = await supabase
				.from("frutos")
				.select(typeof select === "string" ? select : select.join(","))
				.eq("id", frutoId)
				.single()
				.setHeader("Accept", "application/json");

			if (error) throw error;

			return data;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async updateFrutoById(
		frutoId: string,
		updates: Record<string, any>,
	): Promise<{ success: boolean }> {
		if (!frutoId || !updates || typeof updates !== "object") {
			throw new Error("Invalid fruto_id or updates provided");
		}

		try {
			const { error } = await supabase
				.from("frutos")
				.update(updates)
				.eq("id", frutoId)
				.single()
				.setHeader("Accept", "application/json");

			if (error) throw error;

			return { success: true };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async deleteFrutoById(frutoId: string): Promise<{ success: boolean }> {
		if (!frutoId) throw new Error("Invalid fruto_id provided");

		try {
			const { error } = await supabase
				.from("frutos")
				.delete()
				.eq("id", frutoId)
				.setHeader("Accept", "application/json");

			if (error) throw error;

			return { success: true };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}
}
