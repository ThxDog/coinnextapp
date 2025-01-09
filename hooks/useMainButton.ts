import { useMainButton as useMainButtonComponent } from "@telegram-apps/sdk-react";
import { useEffect } from "react";

type Props = {
	text: string;
	onClick: () => void;
	isEnabled?: boolean;
	isVisible?: boolean;
};

export const useMainButton = ({ text, onClick, isEnabled = true }: Props) => {
	const mainButton = useMainButtonComponent();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		mainButton.on("click", onClick);
		mainButton.setParams({
			isEnabled,
			isVisible: true,
			text: text.toUpperCase(),
			bgColor: "#0098EA",
			textColor: "#ffffff",
		});

		return () => {
			mainButton.off("click", onClick);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEnabled, text, onClick]);

	return mainButton;
};
