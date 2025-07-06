using CounterStrike2GSI;
using CounterStrike2GSI.EventMessages;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add GameStateListener as singleton
var gameStateListener = new GameStateListener(4000);
builder.Services.AddSingleton(gameStateListener);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();

// Configure the application to listen on port 5000
app.Urls.Clear();
app.Urls.Add("http://localhost:5000");

// Start the GameStateListener
if (!gameStateListener.GenerateGSIConfigFile("CS2GSI-API"))
{
    Console.WriteLine("Could not generate GSI configuration file.");
}

if (!gameStateListener.Start())
{
    Console.WriteLine("GameStateListener could not start. Try running this program as Administrator.");
}
else
{
    Console.WriteLine("GameStateListener started successfully on port 4000");
}

// Global variable to store the latest game state
GameState? latestGameState = null;

// Subscribe to game state updates
gameStateListener.NewGameState += (gameState) =>
{
    latestGameState = gameState;
};

// Endpoint to get all available information
app.MapGet("/api/gamestate", () =>
{
    if (latestGameState == null)
    {
        return Results.NotFound("No game state data available. Make sure CS2 is running and GSI is configured.");
    }

    var response = new
    {
        timestamp = DateTime.UtcNow,
        provider = new
        {
            name = latestGameState.Provider?.Name,
            appid = latestGameState.Provider?.AppID,
            version = latestGameState.Provider?.Version,
            steamid = latestGameState.Provider?.SteamID,
            timestamp = latestGameState.Provider?.Timestamp
        },
        auth = latestGameState.Auth,
        map = new
        {
            mode = latestGameState.Map?.Mode,
            name = latestGameState.Map?.Name,
            phase = latestGameState.Map?.Phase,
            round = latestGameState.Map?.Round,
            team_ct = latestGameState.Map?.CTStatistics,
            team_t = latestGameState.Map?.TStatistics,
            num_matches_to_win_series = latestGameState.Map?.NumberOfMatchesToWinSeries
        },
        round = new
        {
            phase = latestGameState.Round?.Phase
        },
        player = new
        {
            steamid = latestGameState.Player?.SteamID,
            name = latestGameState.Player?.Name,
            observer_slot = latestGameState.Player?.ObserverSlot,
            team = latestGameState.Player?.Team,
            activity = latestGameState.Player?.Activity,
            state = new
            {
                health = latestGameState.Player?.State?.Health,
                armor = latestGameState.Player?.State?.Armor,
                helmet = latestGameState.Player?.State?.HasHelmet,
                defusekit = latestGameState.Player?.State?.HasDefuseKit,
                flashed = latestGameState.Player?.State?.FlashAmount,
                smoked = latestGameState.Player?.State?.SmokedAmount,
                burning = latestGameState.Player?.State?.BurningAmount,
                money = latestGameState.Player?.State?.Money,
                round_kills = latestGameState.Player?.State?.RoundKills,
                round_killhs = latestGameState.Player?.State?.RoundHSKills,
                round_totaldmg = latestGameState.Player?.State?.RoundTotalDamage,
                equip_value = latestGameState.Player?.State?.EquipmentValue
            },
            weapons = latestGameState.Player?.Weapons?.Select(w => new
            {
                name = w.Name,
                paintkit = w.PaintKit,
                type = w.Type,
                state = w.State,
                ammo_clip = w.AmmoClip,
                ammo_clip_max = w.AmmoClipMax,
                ammo_reserve = w.AmmoReserve
            }).ToList(),
            match_stats = new
            {
                kills = latestGameState.Player?.MatchStats?.Kills,
                assists = latestGameState.Player?.MatchStats?.Assists,
                deaths = latestGameState.Player?.MatchStats?.Deaths,
                mvps = latestGameState.Player?.MatchStats?.MVPs,
                score = latestGameState.Player?.MatchStats?.Score
            },
            position = new
            {
                x = latestGameState.Player?.Position.X,
                y = latestGameState.Player?.Position.Y,
                z = latestGameState.Player?.Position.Z
            }
        },
        allplayers = latestGameState.AllPlayers?.Select(p => new
        {
            steamid = p.Value.SteamID,
            name = p.Value.Name,
            observer_slot = p.Value.ObserverSlot,
            team = p.Value.Team,
            activity = p.Value.Activity,
            state = new
            {
                health = p.Value.State?.Health,
                armor = p.Value.State?.Armor,
                helmet = p.Value.State?.HasHelmet,
                defusekit = p.Value.State?.HasDefuseKit,
                flashed = p.Value.State?.FlashAmount,
                smoked = p.Value.State?.SmokedAmount,
                burning = p.Value.State?.BurningAmount,
                money = p.Value.State?.Money,
                round_kills = p.Value.State?.RoundKills,
                round_killhs = p.Value.State?.RoundHSKills,
                round_totaldmg = p.Value.State?.RoundTotalDamage,
                equip_value = p.Value.State?.EquipmentValue
            },
            weapons = p.Value.Weapons?.Select(w => new
            {
                name = w.Name,
                paintkit = w.PaintKit,
                type = w.Type,
                state = w.State,
                ammo_clip = w.AmmoClip,
                ammo_clip_max = w.AmmoClipMax,
                ammo_reserve = w.AmmoReserve
            }).ToList(),
            match_stats = new
            {
                kills = p.Value.MatchStats?.Kills,
                assists = p.Value.MatchStats?.Assists,
                deaths = p.Value.MatchStats?.Deaths,
                mvps = p.Value.MatchStats?.MVPs,
                score = p.Value.MatchStats?.Score
            },
            position = new
            {
                x = p.Value.Position.X,
                y = p.Value.Position.Y,
                z = p.Value.Position.Z
            }
        }).ToList(),
        bomb = new
        {
            state = latestGameState.Bomb?.State,
            position = new
            {
                x = latestGameState.Bomb?.Position.X,
                y = latestGameState.Bomb?.Position.Y,
                z = latestGameState.Bomb?.Position.Z
            },
            player = latestGameState.Bomb?.Player
        },
        allgrenades = latestGameState.AllGrenades?.Select(g => new
        {
            owner = g.Value.Owner,
            position = new
            {
                x = g.Value.Position.X,
                y = g.Value.Position.Y,
                z = g.Value.Position.Z
            },
            velocity = new
            {
                x = g.Value.Velocity.X,
                y = g.Value.Velocity.Y,
                z = g.Value.Velocity.Z
            },
            lifetime = g.Value.Lifetime,
            type = g.Value.Type,
            effecttime = g.Value.EffectTime
        }).ToList()
    };

    return Results.Ok(response);
});

// Endpoint to get only player information
app.MapGet("/api/player", () =>
{
    if (latestGameState?.Player == null)
    {
        return Results.NotFound("No player data available.");
    }

    var playerResponse = new
    {
        steamid = latestGameState.Player.SteamID,
        name = latestGameState.Player.Name,
        observer_slot = latestGameState.Player.ObserverSlot,
        team = latestGameState.Player.Team,
        activity = latestGameState.Player.Activity,
        state = new
        {
            health = latestGameState.Player.State?.Health,
            armor = latestGameState.Player.State?.Armor,
            helmet = latestGameState.Player.State?.HasHelmet,
            defusekit = latestGameState.Player.State?.HasDefuseKit,
            flashed = latestGameState.Player.State?.FlashAmount,
            smoked = latestGameState.Player.State?.SmokedAmount,
            burning = latestGameState.Player.State?.BurningAmount,
            money = latestGameState.Player.State?.Money,
            round_kills = latestGameState.Player.State?.RoundKills,
            round_killhs = latestGameState.Player.State?.RoundHSKills,
            round_totaldmg = latestGameState.Player.State?.RoundTotalDamage,
            equip_value = latestGameState.Player.State?.EquipmentValue
        },
        weapons = latestGameState.Player.Weapons?.Select(w => new
        {
            name = w.Name,
            paintkit = w.PaintKit,
            type = w.Type,
            state = w.State,
            ammo_clip = w.AmmoClip,
            ammo_clip_max = w.AmmoClipMax,
            ammo_reserve = w.AmmoReserve
        }).ToList(),
        match_stats = new
        {
            kills = latestGameState.Player.MatchStats?.Kills,
            assists = latestGameState.Player.MatchStats?.Assists,
            deaths = latestGameState.Player.MatchStats?.Deaths,
            mvps = latestGameState.Player.MatchStats?.MVPs,
            score = latestGameState.Player.MatchStats?.Score
        },
        position = new
        {
            x = latestGameState.Player.Position.X,
            y = latestGameState.Player.Position.Y,
            z = latestGameState.Player.Position.Z
        }
    };

    return Results.Ok(playerResponse);
});

// Endpoint to get only map information
app.MapGet("/api/map", () =>
{
    if (latestGameState?.Map == null)
    {
        return Results.NotFound("No map data available.");
    }

    var mapResponse = new
    {
        mode = latestGameState.Map.Mode,
        name = latestGameState.Map.Name,
        phase = latestGameState.Map.Phase,
        round = latestGameState.Map.Round,
        team_ct = latestGameState.Map.CTStatistics,
        team_t = latestGameState.Map.TStatistics,
        num_matches_to_win_series = latestGameState.Map.NumberOfMatchesToWinSeries
    };

    return Results.Ok(mapResponse);
});

// Endpoint to get only all players information
app.MapGet("/api/allplayers", () =>
{
    if (latestGameState?.AllPlayers == null)
    {
        return Results.NotFound("No all players data available.");
    }

    var allPlayersResponse = latestGameState.AllPlayers.Select(p => new
    {
        steamid = p.Value.SteamID,
        name = p.Value.Name,
        observer_slot = p.Value.ObserverSlot,
        team = p.Value.Team,
        activity = p.Value.Activity,
        state = new
        {
            health = p.Value.State?.Health,
            armor = p.Value.State?.Armor,
            helmet = p.Value.State?.HasHelmet,
            defusekit = p.Value.State?.HasDefuseKit,
            flashed = p.Value.State?.FlashAmount,
            smoked = p.Value.State?.SmokedAmount,
            burning = p.Value.State?.BurningAmount,
            money = p.Value.State?.Money,
            round_kills = p.Value.State?.RoundKills,
            round_killhs = p.Value.State?.RoundHSKills,
            round_totaldmg = p.Value.State?.RoundTotalDamage,
            equip_value = p.Value.State?.EquipmentValue
        },
        weapons = p.Value.Weapons?.Select(w => new
        {
            name = w.Name,
            paintkit = w.PaintKit,
            type = w.Type,
            state = w.State,
            ammo_clip = w.AmmoClip,
            ammo_clip_max = w.AmmoClipMax,
            ammo_reserve = w.AmmoReserve
        }).ToList(),
        match_stats = new
        {
            kills = p.Value.MatchStats?.Kills,
            assists = p.Value.MatchStats?.Assists,
            deaths = p.Value.MatchStats?.Deaths,
            mvps = p.Value.MatchStats?.MVPs,
            score = p.Value.MatchStats?.Score
        },
        position = new
        {
            x = p.Value.Position.X,
            y = p.Value.Position.Y,
            z = p.Value.Position.Z
        }
    }).ToList();

    return Results.Ok(allPlayersResponse);
});

// Endpoint to get only bomb information
app.MapGet("/api/bomb", () =>
{
    if (latestGameState?.Bomb == null)
    {
        return Results.NotFound("No bomb data available.");
    }

    var bombResponse = new
    {
        state = latestGameState.Bomb.State,
        position = new
        {
            x = latestGameState.Bomb.Position.X,
            y = latestGameState.Bomb.Position.Y,
            z = latestGameState.Bomb.Position.Z
        },
        player = latestGameState.Bomb.Player
    };

    return Results.Ok(bombResponse);
});

// Endpoint to get only grenades information
app.MapGet("/api/grenades", () =>
{
    if (latestGameState?.AllGrenades == null)
    {
        return Results.NotFound("No grenades data available.");
    }

    var grenadesResponse = latestGameState.AllGrenades.Select(g => new
    {
        owner = g.Value.Owner,
        position = new
        {
            x = g.Value.Position.X,
            y = g.Value.Position.Y,
            z = g.Value.Position.Z
        },
        velocity = new
        {
            x = g.Value.Velocity.X,
            y = g.Value.Velocity.Y,
            z = g.Value.Velocity.Z
        },
        lifetime = g.Value.Lifetime,
        type = g.Value.Type,
        effecttime = g.Value.EffectTime
    }).ToList();

    return Results.Ok(grenadesResponse);
});

// Endpoint to get detailed team information including money, win/loss history
app.MapGet("/api/teams", () =>
{
    if (latestGameState?.Map == null || latestGameState?.AllPlayers == null)
    {
        return Results.NotFound("No team data available.");
    }

    // Calculate team money and other statistics
    var ctPlayers = latestGameState.AllPlayers.Where(p => p.Value.Team == CounterStrike2GSI.Nodes.PlayerTeam.CT).ToList();
    var tPlayers = latestGameState.AllPlayers.Where(p => p.Value.Team == CounterStrike2GSI.Nodes.PlayerTeam.T).ToList();

    var ctTotalMoney = ctPlayers.Sum(p => p.Value.State?.Money ?? 0);
    var tTotalMoney = tPlayers.Sum(p => p.Value.State?.Money ?? 0);

    var ctAlivePlayers = ctPlayers.Count(p => p.Value.State?.Health > 0);
    var tAlivePlayers = tPlayers.Count(p => p.Value.State?.Health > 0);

    var response = new
    {
        timestamp = DateTime.UtcNow,
        team_ct = new
        {
            score = latestGameState.Map.CTStatistics?.Score,
            name = latestGameState.Map.CTStatistics?.Name,
            flag = latestGameState.Map.CTStatistics?.Flag,
            consecutive_round_losses = latestGameState.Map.CTStatistics?.ConsecutiveRoundLosses,
            remaining_timeouts = latestGameState.Map.CTStatistics?.RemainingTimeouts,
            matches_won_this_series = latestGameState.Map.CTStatistics?.MatchesWonThisSeries,
            total_money = ctTotalMoney,
            alive_players = ctAlivePlayers,
            total_players = ctPlayers.Count,
            players = ctPlayers.Select(p => new
            {
                steamid = p.Value.SteamID,
                name = p.Value.Name,
                money = p.Value.State?.Money,
                health = p.Value.State?.Health,
                alive = p.Value.State?.Health > 0,
                kills = p.Value.MatchStats?.Kills,
                deaths = p.Value.MatchStats?.Deaths,
                assists = p.Value.MatchStats?.Assists,
                score = p.Value.MatchStats?.Score
            }).ToList()
        },
        team_t = new
        {
            score = latestGameState.Map.TStatistics?.Score,
            name = latestGameState.Map.TStatistics?.Name,
            flag = latestGameState.Map.TStatistics?.Flag,
            consecutive_round_losses = latestGameState.Map.TStatistics?.ConsecutiveRoundLosses,
            remaining_timeouts = latestGameState.Map.TStatistics?.RemainingTimeouts,
            matches_won_this_series = latestGameState.Map.TStatistics?.MatchesWonThisSeries,
            total_money = tTotalMoney,
            alive_players = tAlivePlayers,
            total_players = tPlayers.Count,
            players = tPlayers.Select(p => new
            {
                steamid = p.Value.SteamID,
                name = p.Value.Name,
                money = p.Value.State?.Money,
                health = p.Value.State?.Health,
                alive = p.Value.State?.Health > 0,
                kills = p.Value.MatchStats?.Kills,
                deaths = p.Value.MatchStats?.Deaths,
                assists = p.Value.MatchStats?.Assists,
                score = p.Value.MatchStats?.Score
            }).ToList()
        },
        current_round = latestGameState.Map.Round,
        map_phase = latestGameState.Map.Phase,
        map_name = latestGameState.Map.Name
    };

    return Results.Ok(response);
});

// Endpoint to get lossbonus information
app.MapGet("/api/lossbonus", () =>
{
    if (latestGameState?.Map == null)
    {
        return Results.NotFound("No lossbonus data available.");
    }

    // Calculate lossbonus based on consecutive round losses
    // CS2 lossbonus formula: $1400 + ($500 * consecutive_losses)
    var ctLossBonus = 1400 + (500 * (latestGameState.Map.CTStatistics?.ConsecutiveRoundLosses ?? 0));
    var tLossBonus = 1400 + (500 * (latestGameState.Map.TStatistics?.ConsecutiveRoundLosses ?? 0));

    var response = new
    {
        timestamp = DateTime.UtcNow,
        team_ct = new
        {
            consecutive_round_losses = latestGameState.Map.CTStatistics?.ConsecutiveRoundLosses,
            lossbonus = ctLossBonus,
            base_lossbonus = 1400,
            bonus_per_loss = 500
        },
        team_t = new
        {
            consecutive_round_losses = latestGameState.Map.TStatistics?.ConsecutiveRoundLosses,
            lossbonus = tLossBonus,
            base_lossbonus = 1400,
            bonus_per_loss = 500
        },
        current_round = latestGameState.Map.Round,
        map_phase = latestGameState.Map.Phase
    };

    return Results.Ok(response);
});

// Health check endpoint
app.MapGet("/api/health", () =>
{
    return Results.Ok(new
    {
        status = "healthy",
        timestamp = DateTime.UtcNow,
        hasGameState = latestGameState != null,
        gsiPort = 4000
    });
});

app.Run(); 