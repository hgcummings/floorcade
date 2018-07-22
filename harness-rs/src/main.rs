extern crate clap;
extern crate sdl2;
extern crate serde;
extern crate serde_json;

#[macro_use]
extern crate serde_derive;

use std::fmt;
use std::fmt::{Debug, Display, Formatter};
use std::fs::File;
use std::io;
use std::io::{Read, Write};
use std::process::{Command, ExitStatus, Stdio};

use sdl2::event::Event;
use sdl2::keyboard::Keycode;
use sdl2::pixels::PixelFormatEnum;
use std::collections::{HashMap, HashSet};

use clap::{App, Arg};
use std::path::PathBuf;

const WIDTH: usize = 72;
const HEIGHT: usize = 36;

#[derive(Deserialize)]
struct PlayersInfo {
    min: u8,
    max: u8,
}
#[derive(Deserialize)]
struct GameInfo {
    title: String,
    command: String,
    players: PlayersInfo,
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
enum GameKeys {
    DU, // D-pad UP
    DR, // D-pad Right
    DD, // D-pad Down
    DL, // D-pad Left
    FT, // Face Top
    FR, // Face Right
    FB, // Face Bottom
    FL, // Face Left
    SR, // Start
    SL, // Select
    LS, // Left Shoulder
    RS, // Right Shoulder
}

impl Display for GameKeys {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        Debug::fmt(self, f)
    }
}

#[derive(Debug)]
enum HarnessError {
    SdlInit(),
    GameInitIo(io::Error),
    GameJson(),
    GameSpawn(io::Error),
    GameIo(io::Error),
    GameExit(io::Error),
    GameStatus(ExitStatus),
}

impl fmt::Display for HarnessError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            HarnessError::SdlInit() => write!(f, "SDL init error"),
            HarnessError::GameInitIo(ref err) => write!(f, "Game IO Error: {}", err),
            HarnessError::GameJson() => write!(f, "Game JSON Error"),
            HarnessError::GameSpawn(ref err) => write!(f, "Game Spawn Error: {}", err),
            HarnessError::GameIo(ref err) => write!(f, "Game IO Error: {}", err),
            HarnessError::GameExit(ref err) => write!(f, "Game Exit Error: {}", err),
            HarnessError::GameStatus(ref exit) => {
                write!(f, "Game returned non zero status: {}", exit)
            }
        }
    }
}

impl std::error::Error for HarnessError {
    fn cause(&self) -> Option<&std::error::Error> {
        match *self {
            HarnessError::SdlInit() => None,
            HarnessError::GameInitIo(ref err) => Some(err),
            HarnessError::GameJson() => None,
            HarnessError::GameSpawn(ref err) => Some(err),
            HarnessError::GameIo(ref err) => Some(err),
            HarnessError::GameExit(ref err) => Some(err),
            HarnessError::GameStatus(_) => None,
        }
    }
}

fn main() {
    match main_res() {
        Err(err) => {
            eprintln!("Exiting due to error: {}", err);
        }
        Ok(()) => {
            eprintln!("Goodbye!");
        }
    }
}

// A couple of macros for handling errors from read/write.
// UnexpectedEof for read and WriteZero for write indicate the game exited,
// so we should just exit.
macro_rules! game_read {
    ($x:expr) => {
        match $x {
            Ok(_) => {}
            Err(err) => {
                return match err.kind() {
                    io::ErrorKind::UnexpectedEof => Ok(()),
                    _ => Err(HarnessError::GameIo(err)),
                }
            }
        };
    };
}

macro_rules! game_write {
    ($x:expr) => {
        match $x {
            Ok(_) => {}
            Err(err) => {
                return match err.kind() {
                    io::ErrorKind::WriteZero => Ok(()),
                    _ => Err(HarnessError::GameIo(err)),
                }
            }
        };
    };
}

fn main_res() -> Result<(), HarnessError> {
    let matches = App::new("Floorcade")
        .version("0.1")
        .arg(
            Arg::with_name("GAME")
                .help("Game to run")
                .required(true)
                .index(1),
        )
        .get_matches();

    let game_name = matches.value_of("GAME").unwrap();

    println!("Loading {}", game_name);

    let sdl_context = sdl2::init().map_err(|_| HarnessError::SdlInit())?;
    let video_subsystem = sdl_context.video().map_err(|_| HarnessError::SdlInit())?;

    let (window_width, window_height) = (WIDTH * 10, HEIGHT * 10);

    let window = video_subsystem
        .window("Floorcade", window_width as u32, window_height as u32)
        .position_centered()
        .build()
        .map_err(|_| HarnessError::SdlInit())?;

    let mut canvas = window
        .into_canvas()
        .build()
        .map_err(|_| HarnessError::SdlInit())?;
    let mut event_pump = sdl_context
        .event_pump()
        .map_err(|_| HarnessError::SdlInit())?;

    let texture_creator = canvas.texture_creator();

    let mut texture = texture_creator
        .create_texture_streaming(PixelFormatEnum::RGB24, WIDTH as u32, HEIGHT as u32)
        .map_err(|_| HarnessError::SdlInit())?;

    let mut game_dir = PathBuf::from("../games/");
    game_dir.push(game_name);

    let mut game_json_path = game_dir.clone();
    game_json_path.push("game.json");

    let game_json_file = File::open(game_json_path).map_err(|e| HarnessError::GameInitIo(e))?;

    let game_info: GameInfo =
        serde_json::from_reader(game_json_file).map_err(|_| HarnessError::GameJson())?;

    println!("Game supports {}-{} players", game_info.players.min, game_info.players.max);

    if let Err(e) = canvas
        .window_mut()
        .set_title(format!("Floorcade: {}", game_info.title).as_str())
    {
        eprintln!("Couldn't update window title: {}", e);
    };

    println!("Running \"{}\"", game_info.command);
    let command_vec: Vec<&str> = game_info.command.split(' ').collect();
    let mut command = Command::new(command_vec[0]);
    command.stdin(Stdio::piped());
    command.stdout(Stdio::piped());
    command.stderr(Stdio::inherit());
    for arg in command_vec.into_iter().skip(1) {
        command.arg(arg);
    }
    command.arg("--width");
    command.arg(WIDTH.to_string());
    command.arg("--height");
    command.arg(HEIGHT.to_string());
    command.current_dir(game_dir);

    let key_map: HashMap<Keycode, GameKeys> = [
        (Keycode::W, GameKeys::DU),
        (Keycode::D, GameKeys::DR),
        (Keycode::S, GameKeys::DD),
        (Keycode::A, GameKeys::DL),
        (Keycode::I, GameKeys::FT),
        (Keycode::L, GameKeys::FR),
        (Keycode::K, GameKeys::FB),
        (Keycode::J, GameKeys::FL),
        (Keycode::Q, GameKeys::LS),
        (Keycode::O, GameKeys::RS),
        (Keycode::T, GameKeys::SL),
        (Keycode::Y, GameKeys::SR),
    ].iter()
        .cloned()
        .collect();

    let mut game = command.spawn().map_err(|e| HarnessError::GameSpawn(e))?;
    {
        let game_stdin = game.stdin.as_mut().unwrap();
        let game_stdout = game.stdout.as_mut().unwrap();

        let mut key_ups: HashSet<GameKeys> = HashSet::with_capacity(8);
        let mut key_downs: HashSet<GameKeys> = HashSet::with_capacity(8);
        // Player is 1 indexed
        let mut current_player: i32 = 1;

        let mut ready = [0; 6];
        game_read!(game_stdout.read_exact(&mut ready));

        assert!(ready == "READY\n".as_bytes());
        println!("Game ready!");

        'running: loop {
            key_ups.clear();
            key_downs.clear();

            for event in event_pump.poll_iter() {
                match event {
                    Event::Quit { .. }
                    | Event::KeyDown {
                        keycode: Some(Keycode::Escape),
                        ..
                    } => break 'running,
                    _ => {}
                }

                // Fill our key event sets.
                match event {
                    Event::KeyUp {
                        keycode: Some(keycode),
                        ..
                    } => {
                        if let Some(&key) = key_map.get(&keycode) {
                            key_ups.insert(key);
                        }
                    }
                    Event::KeyDown {
                        keycode: Some(keycode),
                        ..
                    } => {
                        if let Some(&key) = key_map.get(&keycode) {
                            key_downs.insert(key);
                        }
                    }
                    _ => {}
                }
            }

            // Create a set of pressed Keys.
            let pressed_keys: HashSet<Keycode> = event_pump
                .keyboard_state()
                .pressed_scancodes()
                .filter_map(Keycode::from_scancode)
                .collect();

            for key in &pressed_keys {
                use Keycode::*;
                match key {
                    num @ Num1 | num @ Num2 | num @ Num3 | num @ Num4 => {
                        let new_player = (*num as i32) - (Num0 as i32); // 1-indexed
                        if new_player != current_player {
                            println!("Controlling player {}", new_player);
                        }
                        current_player = new_player;
                    }
                    _ => {}
                }
            }

            for key in key_downs.iter() {
                game_write!(writeln!(game_stdin, "P{}{}1", current_player, key));
            }
            for key in key_ups.iter() {
                game_write!(writeln!(game_stdin, "P{}{}0", current_player, key));
            }
            game_write!(writeln!(game_stdin, "STICK"));
            game_write!(game_stdin.flush());

            let mut pixels = [0; (WIDTH * HEIGHT * 3) as usize];

            game_read!(game_stdout.read_exact(&mut pixels));

            texture
                .with_lock(None, |buffer: &mut [u8], pitch: usize| {
                    // Gives us `width` chunks, each of size height (pitch).
                    for (y, row) in buffer.chunks_mut(pitch).enumerate() {
                        let pi = y * WIDTH * 3;
                        row.get_mut(0..WIDTH * 3)
                            .unwrap()
                            .copy_from_slice(pixels.get(pi..pi + WIDTH * 3).unwrap());
                    }
                })
                .expect("Failed to lock texture?");

            canvas.clear();
            canvas.copy(&texture, None, None).unwrap();
            canvas.present();
        }

        game_write!(writeln!(game_stdin, "SKILL"));
        game_write!(game_stdin.flush());
    }

    let exit_status = game.wait().map_err(HarnessError::GameExit)?;
    if !exit_status.success() {
        return Err(HarnessError::GameStatus(exit_status));
    }
    Ok(())
}
