export const ColorCard = ({ name, hex }: { name: string; hex: string }) => {
  return (
    <div
      className="p-4 rounded-lg space-y-2 text-center"
      style={{ backgroundColor: "#F8F3D9" }}
    >
      <div
        className="w-full aspect-square rounded-md border-2 border-muted"
        style={{ backgroundColor: hex }}
      />
      <div>
        <p className="font-medium" style={{ color: "#504B38" }}>
          {name}
        </p>
        <p className="text-sm" style={{ color: "#B9B28A" }}>
          {hex}
        </p>
      </div>
    </div>
  );
};
