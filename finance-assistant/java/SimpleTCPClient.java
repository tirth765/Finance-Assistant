import java.io.*;
import java.net.*;

public class SimpleTCPClient {
    public static void main(String[] args) throws IOException {
        Socket socket = new Socket("localhost", 5000);
        PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
        BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));

        out.println("Hello, Server!");
        System.out.println("Server echoed: " + in.readLine());

        socket.close();
 
    }
}
