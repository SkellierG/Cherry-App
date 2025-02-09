import { supabase } from "@services/supabase";

export class MuestrasService {
	async fetchMuestrasByPrevioId(
		previoId: string,
		select: string | string[] = "*",
	): Promise<any[]> {
		if (!previoId) throw new Error("Invalid previo_id provided");

		try {
			//console.log(`Fetching muestras for previo_id: ${previoId}`);

			const { data: muestrasIds, error: muestrasIdsError } = await supabase
				.from("previo_muestras")
				.select("muestra_id")
				.eq("previo_id", previoId)
				.setHeader("Accept", "application/json");

			if (muestrasIdsError) throw muestrasIdsError;
			if (!muestrasIds || muestrasIds.length === 0) return [];

			const muestrasIdsArray = muestrasIds.map((item: any) => item.muestra_id);
			//console.log(`Found muestras IDs: ${muestrasIdsArray}`);

			const { data, error } = await supabase
				.from("muestras")
				.select(typeof select === "string" ? select : select.join(","))
				.in("id", muestrasIdsArray)
				.setHeader("Accept", "application/json");

			if (error) throw error;

			//console.log(`Fetched muestras data: ${JSON.stringify(data)}`);
			return data || [];
		} catch (error: any) {
			console.error("Error in fetchMuestrasByPrevioId:", error);
			throw error;
		}
	}

	async fetchMuestraById(
		muestraId: string,
		select: string | string[] = "*",
	): Promise<any> {
		if (!muestraId) throw new Error("Invalid muestra_id provided");

		try {
			//console.log(`Fetching muestra for id: ${muestraId}`);

			const { data, error } = await supabase
				.from("muestras")
				.select(typeof select === "string" ? select : select.join(","))
				.eq("id", muestraId)
				.single()
				.setHeader("Accept", "application/json");

			if (error) throw error;

			//console.log(`Fetched muestra data: ${JSON.stringify(data)}`);
			return data;
		} catch (error: any) {
			console.error("Error in fetchMuestraById:", error);
			throw error;
		}
	}

	async fetchMuestrasByPrevioIdAll(previoId: string): Promise<any[]> {
		if (!previoId) throw new Error("Invalid previo_id provided");

		try {
			//console.log(`Fetching all muestras for previo_id: ${previoId}`);
			const data = await this.fetchMuestrasByPrevioId(previoId);
			return data;
		} catch (error: any) {
			console.error("Error in fetchMuestrasByPrevioIdAll:", error);
			throw error;
		}
	}

	async fetchMuestraByIdAll(muestraId: string): Promise<any> {
		if (!muestraId) throw new Error("Invalid muestra_id provided");

		try {
			//console.log(`Fetching all data for muestra_id: ${muestraId}`);
			const data = await this.fetchMuestraById(muestraId);
			return data;
		} catch (error: any) {
			console.error("Error in fetchMuestraByIdAll:", error);
			throw error;
		}
	}

	async updateMuestraById(
		muestraId: string,
		updates: Record<string, any>,
	): Promise<{ success: boolean }> {
		if (!muestraId || !updates || typeof updates !== "object") {
			throw new Error("Invalid muestra_id or updates provided");
		}

		try {
			//console.log(
			//	`Updating muestra with id: ${muestraId}, updates: ${JSON.stringify(updates)}`,
			//);

			const { error } = await supabase
				.from("muestras")
				.update(updates)
				.eq("id", muestraId)
				.single()
				.setHeader("Accept", "application/json");

			if (error) throw error;

			//console.log(`Successfully updated muestra with id: ${muestraId}`);
			return { success: true };
		} catch (error: any) {
			console.error("Error in updateMuestraById:", error);
			throw error;
		}
	}

	async deleteMuestraById(muestraId: string): Promise<{ success: boolean }> {
		if (!muestraId) throw new Error("Invalid muestra_id provided");

		try {
			//console.log(`Deleting muestra with id: ${muestraId}`);

			const { error } = await supabase
				.from("muestras")
				.delete()
				.eq("id", muestraId)
				.setHeader("Accept", "application/json");

			if (error) throw error;

			//console.log(`Successfully deleted muestra with id: ${muestraId}`);
			return { success: true };
		} catch (error: any) {
			console.error("Error in deleteMuestraById:", error);
			throw error;
		}
	}

	/**
		{
			"entity_type": "muestra",
			"muestra_id": "uuid-generado",
			"fruto_id": "uuid-generado",
			"centro_frutal_id": "uuid-generado"
		}
	 */
	async createMuestraByPrevioId(previo_id: string) {
		try {
			const { data, error } = await supabase.rpc(
				"insert_with_dependencies_for_entity",
				{
					p_entity_type: "muestra",
					p_previo_id: previo_id,
				},
			);

			if (error) throw error;

			if (data) return { ...data };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}
}
