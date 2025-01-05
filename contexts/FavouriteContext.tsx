import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useSession } from "@/contexts/AuthContext";
import { RecipeTypeID } from "@/types";

interface FavouriteContextType {
	favorites: RecipeTypeID[];
	loading: boolean;
	toggleFavorite: (id: string) => void;
}
// Created a button and passed a prop to all pages but was getting an endless loop error.
const FavouriteContext = createContext<FavouriteContextType | undefined>(
	undefined
);

export const useFavorites = () => {
	const context = useContext(FavouriteContext);
	if (!context) {
		throw new Error("useFavorites must be used within a FavoritesProvider");
	}
	return context;
};
// created a new favourite context to change all the recipes on all pages at the same time.
// had to to specify the context as react.reactnode as it was not being recognized
export const FavoritesProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [favorites, setFavorites] = useState<RecipeTypeID[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const { session } = useSession();

	// fetch the favorites list asynchonously to compare to the current list
	const fetchFavorites = async () => {
		if (!session) return;
		setLoading(true);
		try {
			const response = await axios.get(
				`${process.env.EXPO_PUBLIC_DEV_URL}users/favourites`,
				{
					headers: { Authorization: `Bearer ${session}` },
				}
			);
			setFavorites(response.data.favourites); // Update the favorites list
		} catch (error) {
			console.error("Error fetching favorites", error);
		} finally {
			setLoading(false);
		}
	};
// used useEffect to fetch the favourites and update the list
	useEffect(() => {
		fetchFavorites();
	}, [session]);

	// toggle the favorite status of a recipe
	const toggleFavorite = (id: string) => {
		const isFav = favorites.some((fav) => fav._id === id);
		const url = `${process.env.EXPO_PUBLIC_DEV_URL}users/favourites/${id}`;
		const headers = { Authorization: `Bearer ${session}` };
// used axios to delete and post the favourites
		if (isFav) {
			axios
				.delete(url, { headers })
				.then(() => {
					setFavorites(favorites.filter((fav) => fav._id !== id));
				})
				.catch((error) =>
					console.error("Error removing from favorites", error)
				);
		} else {
			axios
				.post(url, {}, { headers })
				.then(() => {
					fetchFavorites();
				})
				.catch((error) => console.error("Error adding to favorites", error));
		}
	};
// used the provider to pass the favourites to all pages
	return (
		<FavouriteContext.Provider value={{ favorites, loading, toggleFavorite }}>
			{children}
		</FavouriteContext.Provider>
	);
};
