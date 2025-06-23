import geopandas as gpd

def shapefile_to_geojson(shapefile_path: str, output_path: str):
    # shapefileを読み込み
    gdf = gpd.read_file(shapefile_path)

    # GeoJSONファイルとして保存
    gdf.to_file(output_path, driver='GeoJSON')

    print("GeoJSONファイルの生成が完了しました")
