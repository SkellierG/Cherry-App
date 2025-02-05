import { supabase } from "@services/supabase";

export class PreviosService {
	async fetchPreviosByCompanyId(
		companyId: string,
		select: string | string[] = "*",
	): Promise<any[]> {
		if (!companyId) throw new Error("Invalid company_id provided");

		try {
			const { data: previosId, error: previosIdError } = await supabase
				.from("company_previos")
				.select("previo_id")
				.eq("company_id", companyId)
				.setHeader("Accept", "application/json");

			if (previosIdError) throw previosIdError;
			if (!previosId || previosId.length === 0) return [];

			const previosIdsArray = previosId.map((item: any) => item.previo_id);

			const { data, error } = await supabase
				.from("previos")
				.select(typeof select === "string" ? select : select.join(","))
				.in("id", previosIdsArray)
				.setHeader("Accept", "application/json");

			if (error) throw error;

			return data || [];
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async fetchPrevioById(
		previoId: string,
		select: string | string[] = "*",
	): Promise<any> {
		if (!previoId) throw new Error("Invalid previo_id provided");

		try {
			const { data, error } = await supabase
				.from("previos")
				.select(typeof select === "string" ? select : select.join(","))
				.eq("id", previoId)
				.single()
				.setHeader("Accept", "application/json");

			if (error) throw error;

			return data;
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async fetchPreviosByCompanyIdAll(companyId: string): Promise<any[]> {
		if (!companyId) throw new Error("Invalid company_id provided");

		try {
			const data = await this.fetchPreviosByCompanyId(companyId);
			return data;
		} catch (error: any) {
			throw error;
		}
	}

	async fetchPrevioByIdAll(previoId: string): Promise<any> {
		if (!previoId) throw new Error("Invalid previo_id provided");

		try {
			const data = await this.fetchPrevioById(previoId);
			return data;
		} catch (error: any) {
			throw error;
		}
	}

	async updatePrevioById(
		previoId: string,
		updates: Record<string, any>,
	): Promise<{ success: boolean }> {
		if (!previoId || !updates || typeof updates !== "object") {
			throw new Error("Invalid previo_id or updates provided");
		}

		try {
			const { error } = await supabase
				.from("previos")
				.update(updates)
				.eq("id", previoId)
				.single()
				.setHeader("Accept", "application/json");

			if (error) throw error;

			return { success: true };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}

	async deletePrevioById(previoId: string): Promise<{ success: boolean }> {
		if (!previoId) throw new Error("Invalid previo_id provided");

		try {
			const { error } = await supabase
				.from("previos")
				.delete()
				.eq("id", previoId)
				.setHeader("Accept", "application/json");

			if (error) throw error;

			return { success: true };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}
}
