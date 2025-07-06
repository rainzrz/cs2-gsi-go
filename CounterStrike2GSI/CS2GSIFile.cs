using CounterStrike2GSI.Utils;
using System;
using System.IO;

namespace CounterStrike2GSI
{
    /// <summary>
    /// Class handling Game State Integration configuration file generation.
    /// </summary>
    public class CS2GSIFile
    {
        /// <summary>
        /// Attempts to create a Game State Integration configuraion file.<br/>
        /// The configuration will target <c>http://localhost:{port}/</c> address.<br/>
        /// Returns true on success, false otherwise.
        /// </summary>
        /// <param name="name">The name of your integration.</param>
        /// <param name="port">The port for your integration.</param>
        /// <returns>Returns true on success, false otherwise.</returns>
        public static bool CreateFile(string name, int port)
        {
            return CreateFile(name, $"http://localhost:{port}/");
        }

        /// <summary>
        /// Attempts to create a Game State Integration configuraion file.<br/>
        /// The configuration will target the specified URI address.<br/>
        /// Returns true on success, false otherwise.
        /// </summary>
        /// <param name="name">The name of your integration.</param>
        /// <param name="uri">The URI for your integration.</param>
        /// <returns>Returns true on success, false otherwise.</returns>
        public static bool CreateFile(string name, string uri)
        {
            string csgo_path = SteamUtils.GetGamePath(730);

            try
            {
                if (!string.IsNullOrWhiteSpace(csgo_path))
                {
                    string gsifolder = csgo_path + @"\game\csgo\cfg\";
                    Directory.CreateDirectory(gsifolder);
                    string gsifile = gsifolder + @$"gamestate_integration_{name}.cfg";

                    ACF provider_configuration = new ACF();
                    provider_configuration.Items["provider"] = "1";
                    provider_configuration.Items["tournamentdraft"] = "1";
                    provider_configuration.Items["map"] = "1";
                    provider_configuration.Items["map_round_wins"] = "1";
                    provider_configuration.Items["round"] = "1";
                    provider_configuration.Items["player_id"] = "1";
                    provider_configuration.Items["player_state"] = "1";
                    provider_configuration.Items["player_weapons"] = "1";
                    provider_configuration.Items["player_match_stats"] = "1";
                    provider_configuration.Items["player_position"] = "1";
                    provider_configuration.Items["phase_countdowns"] = "1";
                    provider_configuration.Items["allplayers_id"] = "1";
                    provider_configuration.Items["allplayers_state"] = "1";
                    provider_configuration.Items["allplayers_match_stats"] = "1";
                    provider_configuration.Items["allplayers_weapons"] = "1";
                    provider_configuration.Items["allplayers_position"] = "1";
                    provider_configuration.Items["allgrenades"] = "1";
                    provider_configuration.Items["bomb"] = "1";
                    provider_configuration.Items["grenades"] = "1";
                    provider_configuration.Items["auth"] = "1";
                    provider_configuration.Items["allplayers"] = "1";
                    provider_configuration.Items["player"] = "1";
                    provider_configuration.Items["map_phase"] = "1";
                    provider_configuration.Items["map_team_ct"] = "1";
                    provider_configuration.Items["map_team_t"] = "1";
                    provider_configuration.Items["souvenirs_total"] = "1";
                    provider_configuration.Items["current_spectators"] = "1";
                    provider_configuration.Items["kills"] = "1";
                    provider_configuration.Items["assists"] = "1";
                    provider_configuration.Items["deaths"] = "1";
                    provider_configuration.Items["mvps"] = "1";
                    provider_configuration.Items["score"] = "1";
                    provider_configuration.Items["timeouts_remaining"] = "1";
                    provider_configuration.Items["consecutive_round_losses"] = "1";
                    provider_configuration.Items["matches_won_this_series"] = "1";
                    provider_configuration.Items["base_lossbonus"] = "1";
                    provider_configuration.Items["bonus_per_loss"] = "1";
                    provider_configuration.Items["lossbonus"] = "1";
                    provider_configuration.Items["flag"] = "1";
                    provider_configuration.Items["name"] = "1";
                    provider_configuration.Items["team"] = "1";
                    provider_configuration.Items["steamid"] = "1";
                    provider_configuration.Items["uri"] = uri;

                    ACF gsi_configuration = new ACF();
                    gsi_configuration.Items["uri"] = uri;
                    gsi_configuration.Items["timeout"] = "5.0";
                    gsi_configuration.Items["buffer"] = "0.1";
                    gsi_configuration.Items["throttle"] = "0.1";
                    gsi_configuration.Items["heartbeat"] = "10.0";
                    gsi_configuration.Children["data"] = provider_configuration;

                    ACF gsi = new ACF();
                    gsi.Children[$"{name} Integration Configuration"] = gsi_configuration;

                    File.WriteAllText(gsifile, gsi.ToString());

                    return true;
                }
            }
            catch (Exception)
            {
            }

            return false;
        }
    }
}
