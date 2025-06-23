from utils.shapefile_to_geojson import shapefile_to_geojson
import geopandas as gpd
import pandas as pd
import matplotlib.pyplot as plt
import os
import glob
from functools import reduce

def load_data(code: str, stat_prefix: str) -> tuple[gpd.GeoDataFrame, pd.DataFrame]:
    geojson_path = f"mesh/geojson/MESH{code}.geojson"
    # GeoJSONがなければshapefileから生成
    if not os.path.exists(geojson_path):
        # shapefileのパス推定（SDDSWS{code}の下にMESH0{code}.shp）
        shp_path = f"mesh/shapefile/SDDSWS{code}/MESH0{code}.shp"
        shapefile_to_geojson(shp_path, geojson_path)
    gdf = gpd.read_file(geojson_path)

    # 統計データ（txt）読み込み
    df = pd.read_csv(f"data/tbl{stat_prefix}{code}.txt", encoding="shift-jis", skiprows=[1])

    return gdf, df

def merge_data(gdf: gpd.GeoDataFrame, df: pd.DataFrame) -> gpd.GeoDataFrame:
    # メッシュコードを結合
    gdf["KEY_CODE"] = gdf["KEY_CODE"].astype(int)
    df["KEY_CODE"] = df["KEY_CODE"].astype(int)
    
    # Join on KEY_CODE
    merged = gdf.merge(df, on="KEY_CODE", how="left")

    return merged

def plot_data(merged: gpd.GeoDataFrame, column_name: str):
    # Make the plot larger
    fig, ax = plt.subplots(1, 1, figsize=(15, 10))
    # カラム存在チェック
    if column_name not in merged.columns:
        print(f"カラム '{column_name}' が見つかりません。利用可能なカラム: {list(merged.columns)}")
        return
    # Create a choropleth map
    merged.plot(column=column_name, ax=ax, legend=True,
                legend_kwds={'label': column_name,
                            'orientation': "horizontal"})

    # Add a title (optional)
    ax.set_title(f'Choropleth Map of {column_name}')

    # Display the plot
    plt.show()
    
def save_merge_data(merged: gpd.GeoDataFrame, column_name: str):
    # Save the merged data to a CSV file
    merged.to_file(f"mesh/geojson/{column_name}.geojson", driver='GeoJSON')

if __name__ == "__main__":
    code = "5239"

    # 今（T001100S系）
    stat_prefix_now = "T001100S"
    plot_column_now = "T001100001"
    gdf_now, df_now = load_data(code, stat_prefix_now)
    merged_now = merge_data(gdf_now, df_now)
    merged_now.to_file("mesh/geojson/MESH05239_merged_now.geojson", driver='GeoJSON')

    # 昔（T000751S系）
    stat_prefix_old = "T000751S"
    plot_column_old = "T000751001"
    gdf_old, df_old = load_data(code, stat_prefix_old)
    merged_old = merge_data(gdf_old, df_old)
    merged_old.to_file("mesh/geojson/MESH05239_merged_old.geojson", driver='GeoJSON')