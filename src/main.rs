use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::thread;

const INDEX: &str = include_str!("../static/index.html");
const CSS: &str = include_str!("../static/styles.css");
const TUTOR_CSS: &str = include_str!("../static/tutor.css");
const JS: &str = include_str!("../static/app.js");

fn main() -> std::io::Result<()> {
    let address = "127.0.0.1:8080";
    let listener = TcpListener::bind(address)?;
    println!("BrightPath demo: http://{address}");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                thread::spawn(|| {
                    if let Err(error) = handle(stream) {
                        eprintln!("request error: {error}");
                    }
                });
            }
            Err(error) => eprintln!("connection error: {error}"),
        }
    }
    Ok(())
}

fn handle(mut stream: TcpStream) -> std::io::Result<()> {
    let mut buffer = [0_u8; 16_384];
    let bytes = stream.read(&mut buffer)?;
    if bytes == 0 {
        return Ok(());
    }

    let request = String::from_utf8_lossy(&buffer[..bytes]);
    let first_line = request.lines().next().unwrap_or_default();
    let mut parts = first_line.split_whitespace();
    let method = parts.next().unwrap_or("GET");
    let path = parts.next().unwrap_or("/");

    let (status, content_type, body) = match (method, path) {
        ("GET", "/") | ("GET", "/index.html") => ("200 OK", "text/html; charset=utf-8", INDEX),
        ("GET", "/styles.css") => ("200 OK", "text/css; charset=utf-8", CSS),
        ("GET", "/tutor.css") => ("200 OK", "text/css; charset=utf-8", TUTOR_CSS),
        ("GET", "/app.js") => ("200 OK", "text/javascript; charset=utf-8", JS),
        ("GET", "/api/dashboard") => (
            "200 OK",
            "application/json; charset=utf-8",
            r#"{"student":"Mia","streak":5,"weekly_minutes":142,"mastery":68,"next_lesson":"Solving linear equations"}"#,
        ),
        ("POST", "/api/tutor") => (
            "200 OK",
            "application/json; charset=utf-8",
            tutor_reply(&request),
        ),
        _ => ("404 Not Found", "text/plain; charset=utf-8", "Not found"),
    };

    let response = format!(
        "HTTP/1.1 {status}\r\nContent-Type: {content_type}\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
        body.as_bytes().len()
    );
    stream.write_all(response.as_bytes())
}

fn tutor_reply(request: &str) -> &'static str {
    let lower = request.to_ascii_lowercase();
    if lower.contains("subtract") || lower.contains("减") || lower.contains("-6") {
        r#"{"mode":"Socratic","message":"完全正确——等式两边同时减去 6。现在得到 2x = 12，下一步应该怎么做？","translation":"Exactly — subtract 6 from both sides. Now we have 2x = 12. What should we do next?"}"#
    } else if lower.contains("divided first")
        || lower.contains("先除")
        || lower.contains("为什么不行")
    {
        r#"{"mode":"Socratic","message":"先除以 2 会让左边变成 x + 3，仍然还有一个加法步骤。更清楚的顺序是先在两边减去 6，得到 2x = 12；然后再两边除以 2。你能看出为什么先减 6 会更直接吗？","translation":"If we divide by 2 first, the left side becomes x + 3, so an addition step still remains. A clearer order is to subtract 6 from both sides first, giving 2x = 12; then divide both sides by 2. Can you see why subtracting 6 first is more direct?"}"#
    } else if lower.contains("divide") || lower.contains("除") {
        r#"{"mode":"Socratic","message":"除以 2 是后面的步骤。先想一想：要消去左边的 +6，等式两边该做什么相反运算？","translation":"Dividing by 2 is a later step. First, what inverse operation should we do to both sides to remove the +6 on the left?"}"#
    } else {
        r#"{"mode":"Socratic","message":"我们要让 x 单独留在左边。什么运算可以消去左边的 +6？","translation":"We want to get x by itself. Which operation would remove the +6 from the left side?"}"#
    }
}
