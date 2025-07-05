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
app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();

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

    return Results.Ok(latestGameState.Player);
});

// Endpoint to get only map information
app.MapGet("/api/map", () =>
{
    if (latestGameState?.Map == null)
    {
        return Results.NotFound("No map data available.");
    }

    return Results.Ok(latestGameState.Map);
});

// Endpoint to get only all players information
app.MapGet("/api/allplayers", () =>
{
    if (latestGameState?.AllPlayers == null)
    {
        return Results.NotFound("No all players data available.");
    }

    return Results.Ok(latestGameState.AllPlayers);
});

// Endpoint to get only bomb information
app.MapGet("/api/bomb", () =>
{
    if (latestGameState?.Bomb == null)
    {
        return Results.NotFound("No bomb data available.");
    }

    return Results.Ok(latestGameState.Bomb);
});

// Endpoint to get only grenades information
app.MapGet("/api/grenades", () =>
{
    if (latestGameState?.AllGrenades == null)
    {
        return Results.NotFound("No grenades data available.");
    }

    return Results.Ok(latestGameState.AllGrenades);
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