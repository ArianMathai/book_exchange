import { cn } from "@/lib/utils";

interface MagicSparkleProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    style?: React.CSSProperties;
}

export const MagicSparkle = ({ size = "md", className, style }: MagicSparkleProps) => {
    const sizes = {
        sm: "w-2 h-2",
        md: "w-3 h-3",
        lg: "w-4 h-4"
    };

    return (
        <div
            className={cn(
                "magic-sparkle rounded-full bg-accent",
                sizes[size],
                className
            )}
            style={style}
        >
            <div className="w-full h-full rounded-full bg-gradient-magic opacity-80" />
        </div>
    );
};