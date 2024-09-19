General tools for EVE data

Most is sourced from https://everef.net/

https://data.everef.net/reference-data/
https://data.everef.net/ccp/sde/
https://data.everef.net/hoboleaks-sde/
https://data.everef.net/structures/structures-latest.v2.json

Some is sourced from SDE built by EVEShipFit. This generates the SDE from client files directly.
https://github.com/EVEShipFit/sde/releases

Data specifically needed right now is:
market_groups.json (Reference-Data)  
regions.json (Reference-Data)  
staStations.yaml (CCP SDE/bsd)  
structures-latest.v2.json (Everef download)  
types.json (Reference-Data)

You can build the everef API by using:
pnpm everef

Build the ESI swagger typescript client with
pnpm client
