import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PixelButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: "primary" | "secondary";
}

export const PixelButton = ({
                                children,
                                onClick,
                                className,
                                variant = "primary"
                            }: PixelButtonProps) => {
    return (
        <Button
            onClick={onClick}
            className={cn(
                "btn-pixel",
                variant === "secondary" && "bg-secondary hover:bg-secondary/90",
                className
            )}
        >
            {children}
        </Button>
    );
};