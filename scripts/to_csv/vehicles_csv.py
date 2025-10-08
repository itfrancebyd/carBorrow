import pandas as pd

read_file = pd.read_excel("vehicles_info.xlsx")
read_file.to_csv("vehicles_info.csv", index=None)

# Read both CSV files
vehicles = pd.read_csv("vehicles_info.csv")
models = pd.read_csv("vehicle_model_rows.csv")

# Merge the two files based on shared columns
merged = pd.merge(
    vehicles,
    models[["model_name", "version_name", "interior_colour", "exterior_colour", "id"]],
    on=["model_name", "version_name", "interior_colour", "exterior_colour"],
    how="left",  # keeps all rows from vehicles_info
)

# Rename 'id' column to 'model_information'
merged.rename(columns={"id": "model_information"}, inplace=True)

# Save to new CSV file
merged.to_csv("vehicles_info_with_id.csv", index=False, encoding="utf-8")

print(
    f"✅ Done! File 'vehicles_info_with_id.csv' created successfully with {merged.shape[0]} rows."
)
